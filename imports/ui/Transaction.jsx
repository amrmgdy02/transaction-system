import React from 'react';

export const Transaction = ({ transaction, onUpdateClick, onDeleteClick }) => {
  const formatDate = (date) => {
    if (!date) return 'Unspecified Date';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <li className="transaction-item">
      <div className="transaction-header">
        <div className="transaction-amount">${transaction.amount.toFixed(2)}</div>
        <div className="transaction-actions">
          <button className="edit-btn" onClick={() => onUpdateClick(transaction)}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => onDeleteClick(transaction)}>
            Delete
          </button>
        </div>
      </div>
      
      <div className="transaction-details">
        <div><strong>From:</strong> {transaction.senderUsername}</div>
        <div><strong>To:</strong> {transaction.receiverUsername}</div>
        <div><strong>Processed by:</strong> {transaction.accountantUsername}</div>
        <div><strong>Date:</strong> {formatDate(transaction.createdAt)}</div>
      </div>
    </li>
  );
};
