import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ title, onClose, children }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    // Prevent background scroll while the modal is open.
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="task-modal-overlay" onClick={onClose}>
      <div
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-modal__header">
          <h2 id="modal-title" className="task-modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="task-modal__close"
            onClick={onClose}
            aria-label="Close"
            ref={closeButtonRef}
          >
            &times;
          </button>
        </div>
        <div className="task-modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
