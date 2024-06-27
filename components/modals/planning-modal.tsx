import React, { useState } from "react";
import Modal from "react-modal";

interface PlanningModalProps {
  onConfirm: (comment: string, habitIndex?: number | null) => void;
  isOpen: boolean;
  closeModal: () => void;
}

export default function PlanningModal({
  onConfirm,
  isOpen,
  closeModal,
}: PlanningModalProps) {
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(comment);
    setComment(""); // Очистити коментар після підтвердження
    closeModal(); // Закрити модальне вікно після підтвердження
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Add Comment</h2>
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment..."
          className="textarea"
        />
      </div>
      <button onClick={handleConfirm} className="save-button">
        Save
      </button>
      <button onClick={closeModal} className="close-button">
        Cancel
      </button>
    </Modal>
  );
}
