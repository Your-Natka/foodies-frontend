import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "../shared/modal/Modal";
import { useInstallApp } from "../../hooks/useInstallApp";

import "./InstallAppButton.scss";

function InstallAppButton({ className = "", onDone, tabIndex }) {
  const { canInstall, needsManualSteps, isIOS, install } = useInstallApp();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (!canInstall) return null;

  const handleClick = async () => {
    if (needsManualSteps) {
      setIsHelpOpen(true);
      return;
    }

    try {
      const outcome = await install();

      if (outcome === "accepted") {
        toast.success("Foodies is being installed on your device.");
      } else if (outcome === "dismissed") {
        toast.info("Installation was cancelled.");
      } else {
        setIsHelpOpen(true);
      }

      onDone?.();
    } catch (error) {
      console.error("PWA installation failed:", error);
      toast.error("Unable to start installation. Please try again.");
    }
  };

  return (
    <>
      <button
        type="button"
        className={`install-app-button ${className}`}
        onClick={handleClick}
        tabIndex={tabIndex}
      >
        <svg className="install-app-button__icon" aria-hidden="true">
          <use href="/images/sprite.svg#icon-download" />
        </svg>
        <span className="install-app-button__text">Install app</span>
      </button>

      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Install Foodies"
        className="install-help"
      >
        {isIOS ? (
          <>
            <ol className="install-help__steps">
              <li>
                Open this site in <strong>Safari</strong>.
              </li>
              <li>
                Tap the <strong>Share</strong> button{" "}
                <span aria-hidden="true">(□↑)</span> in the toolbar.
              </li>
              <li>
                Choose <strong>Add to Home Screen</strong>, then tap{" "}
                <strong>Add</strong>.
              </li>
            </ol>
          </>
        ) : (
          <p className="install-help__note">
            Open your browser menu and look for an option such as
            <strong> Install app</strong> or{" "}
            <strong>Install this site as an app</strong>. If this option is
            unavailable, try opening Foodies in Chrome or Edge.
          </p>
        )}
      </Modal>
    </>
  );
}

export default InstallAppButton;
