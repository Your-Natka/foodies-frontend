const AUTH_SESSION_KEY = "foodies-has-session";

export const hasStoredSession = () =>
    localStorage.getItem(AUTH_SESSION_KEY) === "true";

export const markSessionExists = () =>
    localStorage.setItem(AUTH_SESSION_KEY, "true");

export const clearStoredSession = () =>
    localStorage.removeItem(AUTH_SESSION_KEY);