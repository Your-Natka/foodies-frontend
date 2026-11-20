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

const APP_KEY_PREFIX = "foodies";

// Removes only this app's keys, preserving data belonging to other apps.
export const clearAppStorage = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(APP_KEY_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Failed to clear app storage:", error);
  }
};
