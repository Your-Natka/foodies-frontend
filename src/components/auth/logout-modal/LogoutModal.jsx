import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Modal from "../../shared/modal/Modal";
import { logoutThunk } from "../../../redux/slices/auth/authOperations";

import "./LogoutModal.scss";

function LogoutModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());

    toast.success("You have been logged out.");
    onClose();
    navigate("/", { replace: true });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
          >
            Log out
          </button>

          <button
            type="button"
            className="logout-modal__cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default LogoutModal;
