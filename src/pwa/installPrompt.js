// Captures the browser's install prompt as early as possible.

let deferredPrompt = null;
let installed = false;

const listeners = new Set();

let snapshot = {
  canPrompt: false,
  installed: false,
};

const emit = () => {
  snapshot = {
    canPrompt: Boolean(deferredPrompt),
    installed,
  };

  listeners.forEach((listener) => listener());
};

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

if (typeof window !== "undefined") {
  installed = isStandalone();

  snapshot = {
    canPrompt: false,
    installed,
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    emit();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installed = true;
    emit();
  });
}

export const subscribeInstall = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getInstallSnapshot = () => snapshot;

export const promptInstall = async () => {
  if (!deferredPrompt) return "unavailable";

  const promptEvent = deferredPrompt;
  deferredPrompt = null;

  emit();

  await promptEvent.prompt();

  const { outcome } = await promptEvent.userChoice;

  return outcome;
};

export const isIOS = () => {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;

  return (
    /iphone|ipad|ipod/i.test(ua) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1)
  );
};
