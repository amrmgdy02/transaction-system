import React, { useState } from 'react';

export const UpdateTransactionForm = ({ transaction, onSave }) => {
    const [senderUsername, setSenderUsername] = useState(transaction.senderUsername);
    const [receiverUsername, setReceiverUsername] = useState(transaction.receiverUsername);
    const [amount, setAmount] = useState(transaction.amount);
    const [createdAt, setCreatedAt] = useState(transaction.createdAt);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!receiverUsername || amount <= 0) return;
    
        await Meteor.callAsync("transactions.update", {
        _id: transaction._id,
        senderUsername,
        receiverUsername,
        amount,
        createdAt: new Date(createdAt),
        });
    
        onSave();
    };
    
    return (
        <form className="task-form" onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Sender Username"
            value={senderUsername}
            onChange={(e) => setSenderUsername(e.target.value)}
        />
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
        <input
            type="datetime-local"
            placeholder="Created At"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
        />
        <button type="submit">Update Transaction</button>
        </form>
    );
    }