import React from "react";

export const Transaction = ({ transaction, onUpdateClick, onDeleteClick }) => {
  return (
    <li className="task">
      <span className="task-text">{transaction.receiverUsername}</span>
      <span>  </span>
      <span className="task-text">{transaction.amount}</span>
      <button className="update-button" onClick={() => onUpdateClick(transaction)}>
        Update
      </button>
      <button className="delete-button" onClick={() => onDeleteClick(transaction)}>
        Delete
      </button>
    </li>
  );
};
