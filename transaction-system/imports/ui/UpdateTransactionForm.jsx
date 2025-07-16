import React, { useState } from 'react';

export const UpdateTransactionForm = ({ transaction, onSave }) => {
    const [receiverUsername, setReceiverUsername] = useState(transaction.receiverUsername);
    const [amount, setAmount] = useState(transaction.amount);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!receiverUsername || amount <= 0) return;
    
        await Meteor.callAsync("transactions.update", {
        _id: transaction._id,
        receiverUsername,
        amount,
        });
    
        onSave();
    };
    
    return (
        <form className="task-form" onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Receiver Username"
            value={receiverUsername}
            onChange={(e) => setReceiverUsername(e.target.value)}
        />
        <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button type="submit">Update Transaction</button>
        </form>
    );
    }