
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 60000,
});

let getAccessToken = () => null;
let setAccessToken = () => {};
let onAuthFailure = () => {};

let refreshPromise = null;
let refreshTimer = null;

const REFRESH_BEFORE_EXPIRY = 60 * 1000;
const RETRY_DELAY = 30 * 1000;
let retryTimer = null;

// read expiration time of JWT
const getTokenExpiry = (token) => {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    const decoded = JSON.parse(atob(padded));

    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        return data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const scheduleRefreshRetry = () => {
  if (retryTimer) {
    clearTimeout(retryTimer);
  }

  retryTimer = setTimeout(async () => {
    retryTimer = null;

    const token = getAccessToken();

    if (!token) return;

    const expiry = getTokenExpiry(token);

    if (!expiry) return;

    // If token is still valid, let the normal timer handle it.
    if (expiry - Date.now() > REFRESH_BEFORE_EXPIRY) {
      scheduleTokenRefresh(token);
      return;
    }

    try {
      await refreshAccessToken();
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) {
        onAuthFailure();
      } else {
        console.error("Token refresh retry failed:", error);
        scheduleRefreshRetry();
      }
    }
  }, RETRY_DELAY);
};

// plan refresh 60s before expiration time
export const scheduleTokenRefresh = (token) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  if (!token) return;

  const expiry = getTokenExpiry(token);

  // if JWT not valid or exp not retrieved do not set timer
  if (!expiry) return;

  const delay = Math.max(
    expiry - Date.now() - REFRESH_BEFORE_EXPIRY,
    0,
  );

  refreshTimer = setTimeout(() => {
    refreshAccessToken().catch((error) => {
      if ([401, 403].includes(error.response?.status)) {
        onAuthFailure();
      } else {
        console.error("Token refresh temporarily failed:", error);
        scheduleRefreshRetry();
      }
    });
  }, delay);
};

export const cancelTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
};

// check token when user is back
const refreshIfNeeded = () => {
  const token = getAccessToken();

  if (!token) return;

  const expiry = getTokenExpiry(token);

  if (!expiry) return;

  if (expiry - Date.now() <= REFRESH_BEFORE_EXPIRY) {
    refreshAccessToken().catch((error) => {
      if ([401, 403].includes(error.response?.status)) {
        onAuthFailure();
      } else {
        console.error("Token refresh temporarily failed:", error);
        scheduleRefreshRetry();
      }
    });
  }
};

export const configureApiAuth = ({ getToken, updateToken, onFailure }) => {
  getAccessToken = getToken;
  setAccessToken = updateToken;
  onAuthFailure = onFailure;

  scheduleTokenRefresh(getAccessToken());

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshIfNeeded();
    }
  });

  window.addEventListener("focus", refreshIfNeeded);
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";

    const isAuthRequest =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout");

    if (isAuthRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const session = await refreshAccessToken();
      const newToken = session.accessToken;

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      if ([401, 403].includes(refreshError.response?.status)) {
        onAuthFailure();
      } else {
        scheduleRefreshRetry();
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;
