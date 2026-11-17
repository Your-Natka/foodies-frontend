export const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode, quota) — ignore.
  }
};

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};
