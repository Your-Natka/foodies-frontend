// Captures the browser's install prompt as early as possible (the event can
// fire before React mounts) and exposes it as a tiny external store.

let deferredPrompt = null;
let installed = false;
const listeners = new Set();
let snapshot = { canPrompt: false, installed: false };

const emit = () => {
  snapshot = { canPrompt: Boolean(deferredPrompt), installed };
  listeners.forEach((listener) => listener());
};

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

if (typeof window !== "undefined") {
  installed = isStandalone();
  snapshot = { canPrompt: false, installed };

  window.addEventListener("beforeinstallprompt", (event) => {
    // Keep the event so we can show the prompt from our own button.
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

// Returns "accepted", "dismissed" or "unavailable".
export const promptInstall = async () => {
  if (!deferredPrompt) return "unavailable";

  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  emit();

  await promptEvent.prompt();
  const { outcome } = await promptEvent.userChoice;
  return outcome;
};

// iOS/iPadOS browsers have no install prompt: users add the site manually.
export const isIOS = () => {
  const ua = window.navigator.userAgent;
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1)
  );
};
