import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRegisterSW } from "virtual:pwa-register/react";

const UPDATE_TOAST_ID = "pwa-update";
const OFFLINE_TOAST_ID = "pwa-offline";
const LEGACY_IMAGE_CACHE = "foodies-images";

function UpdateMessage({ onReload }) {
  return (
    <div className="pwa-toast">
      <span>A new version of Foodies is available.</span>
      <button type="button" className="pwa-toast__button" onClick={onReload}>
        Reload
      </button>
    </div>
  );
}

// Service-worker updates and online/offline notices. Renders nothing itself.
function PwaStatus() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error("Service worker registration failed:", error);
    },
  });

  // Drop the old image cache that filled the storage quota with opaque responses.
  useEffect(() => {
    if (!("caches" in window)) return;

    caches.delete(LEGACY_IMAGE_CACHE).catch(() => {});
  }, []);

  useEffect(() => {
    if (!offlineReady) return;

    toast.success("Foodies is ready to work offline.", { toastId: "pwa-ready" });
    setOfflineReady(false);
  }, [offlineReady, setOfflineReady]);

  useEffect(() => {
    if (!needRefresh) return;

    toast.info(<UpdateMessage onReload={() => updateServiceWorker(true)} />, {
      toastId: UPDATE_TOAST_ID,
      autoClose: false,
      closeOnClick: false,
    });
  }, [needRefresh, updateServiceWorker]);

  useEffect(() => {
    const handleOffline = () =>
      toast.warn("You are offline. Showing recipes saved on this device.", {
        toastId: OFFLINE_TOAST_ID,
        autoClose: false,
      });

    const handleOnline = () => {
      toast.dismiss(OFFLINE_TOAST_ID);
      toast.success("Back online.", { toastId: "pwa-online" });
    };

    if (!navigator.onLine) handleOffline();

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}

export default PwaStatus;
