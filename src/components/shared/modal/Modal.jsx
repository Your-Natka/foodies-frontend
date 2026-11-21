import { useEffect, useRef } from "react";
import "./Modal.scss";

function Modal({ isOpen, onClose, title, children, className = "" }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    const modal = modalRef.current;

    const focusableSelector =
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = () =>
      Array.from(modal?.querySelectorAll(focusableSelector) ?? []).filter(
        (element) => element.getClientRects().length > 0,
      );

    const firstInput = modal?.querySelector(
      'input:not([disabled]):not([type="hidden"])',
    );

    if (firstInput && firstInput.getClientRects().length > 0) {
      firstInput.focus();
    } else {
      getFocusableElements()[0]?.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const elements = getFocusableElements();
      if (!elements.length) {
        event.preventDefault();
        modal?.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!modal?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        ref={modalRef}
        className={`modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <span aria-hidden="true">×</span>
        </button>

        <h2 className="modal__title">{title}</h2>

        {children}
      </section>
    </div>
  );
}

export default Modal;
