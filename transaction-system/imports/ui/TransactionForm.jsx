import React, { useState } from "react";
import "../api/transaction.js";

export const TransactionForm = () => {
  const [senderUsername, setSenderUsername] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [amount, setAmount] = useState(0);
  const [createdAt, setCreatedAt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receiverUsername || amount <= 0) return;
    console.log("Transaction: ", {
      senderUsername,
      receiverUsername,
      amount,
    });
    await Meteor.callAsync("transactions.insert", {
      senderUsername: senderUsername,
      receiverUsername: receiverUsername,
      amount: amount,
      createdAt: new Date(createdAt),
    });
    
    setSenderUsername("");
    setReceiverUsername("");
    setAmount(0);
    setCreatedAt("");
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
      <button type="submit">Add Transaction</button>
    </form>
  );
}