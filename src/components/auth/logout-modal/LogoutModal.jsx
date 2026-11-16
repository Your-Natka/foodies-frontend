import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Modal from "../../shared/modal/Modal";
import { logoutThunk } from "../../../redux/slices/auth/authOperations";

import "./LogoutModal.scss";

function LogoutModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const result = await dispatch(logoutThunk()).unwrap();

      if (result.serverLogoutSucceeded) {
        toast.success("You have been logged out.");
      } else {
        toast.warning(
          "Your local session has ended, but the server could not confirm logout.",
        );
      }

      onClose();
      navigate("/", { replace: true, state: null });
    } catch {
      toast.error("Something went wrong while logging out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoggingOut ? undefined : onClose}
      title="Are you logging out?"
      className="modal--auth modal--logout"
    >
      <div className="logout-modal">
        <p className="logout-modal__text">
          You can always log back in at any time.
        </p>

        <div className="logout-modal__actions">
          <button
            type="button"
            className="logout-modal__confirm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>

          <button
            type="button"
            className="logout-modal__cancel"
            onClick={onClose}
            disabled={isLoggingOut}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default LogoutModal;
