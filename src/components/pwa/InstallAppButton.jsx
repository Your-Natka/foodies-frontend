import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "../shared/modal/Modal";
import { useInstallApp } from "../../hooks/useInstallApp";

import "./InstallAppButton.scss";

function InstallAppButton({ className = "", onDone, tabIndex }) {
  const { canInstall, needsManualSteps, install } = useInstallApp();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (!canInstall) return null;

  const handleClick = async () => {
    if (needsManualSteps) {
      setIsHelpOpen(true);
      return;
    }

    const outcome = await install();
    if (outcome === "accepted") {
      toast.success("Foodies is being installed on your device.");
    }
    onDone?.();
  };

  return (
    <>
      <button
        type="button"
        className={`install-app-button ${className}`}
        onClick={handleClick}
        tabIndex={tabIndex}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Install app
      </button>

      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Install Foodies"
        className="install-help"
      >
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
        <p className="install-help__note">
          Foodies will open like an app, and recipes you have viewed stay
          available offline.
        </p>
      </Modal>
    </>
  );
}

export default InstallAppButton;
