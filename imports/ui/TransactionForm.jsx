import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import '../api/transaction.js';

export const TransactionForm = () => {
  const [senderUsername, setSenderUsername] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!senderUsername || !receiverUsername || !amount || numAmount <= 0) {
      alert('Please fill in all fields with valid data');
      return;
    }
    
    try {
      await Meteor.callAsync('transactions.insert', {
        senderUsername: senderUsername.trim(),
        receiverUsername: receiverUsername.trim(),
        amount: numAmount,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      });
      
      // Reset form
      setSenderUsername('');
      setReceiverUsername('');
      setAmount('');
      setCreatedAt('');
      
      alert('Transaction added successfully!');
    } catch (error) {
      alert('Error adding transaction: ' + error.message);
      console.error('Transaction error:', error);
    }
  };
  
  return (
    <div className="transaction-form">
      <h3>Add New Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Sender Username</label>
            <input
              type="text"
              placeholder="Enter sender username"
              value={senderUsername}
              onChange={(e) => setSenderUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Receiver Username</label>
            <input
              type="text"
              placeholder="Enter receiver username"
              value={receiverUsername}
              onChange={(e) => setReceiverUsername(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Transaction Date</label>
            <input
              type="datetime-local"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              placeholder="Leave empty for current date"
            />
          </div>
        </div>
        
        <button type="submit" className="submit-transaction">
          Add Transaction
        </button>
      </form>
    </div>
  );
};