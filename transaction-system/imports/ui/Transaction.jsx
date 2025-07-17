import React from "react";

export const Transaction = ({ transaction, onUpdateClick, onDeleteClick }) => {
  const formatDate = (date) => {
    if (!date) return 'Unspecified Date';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString();
  };

  return (
    <li className="task">
      <span className="task-text">Accountant: {transaction.accountantUsername}</span>
      <span>    </span>
      <span className="task-text">Sender: {transaction.senderUsername}</span>
      <span>    </span>
      <span className="task-text">Receiver: {transaction.receiverUsername}</span>
      <span>    </span>
      <span className="task-text">Amount: {transaction.amount}</span>
      <span>    </span>
      <span className="task-text">Created At: {formatDate(transaction.createdAt)}</span>

      <button className="update-button" onClick={() => onUpdateClick(transaction)}>
        Update
      </button>
      <button className="delete-button" onClick={() => onDeleteClick(transaction)}>
        Delete
      </button>
    </li>
  );
};
