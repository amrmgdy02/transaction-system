import React, { useState } from "react";
import "../api/transaction.js";

export const TransactionForm = () => {
  const [receiverUsername, setReceiverUsername] = useState("");
  const [amount, setAmount] = useState(0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receiverUsername || amount <= 0) return;

    await Meteor.callAsync("transactions.insert", {
      receiverUsername: receiverUsername,
      amount: amount,
    });
    setReceiverUsername("");
    setAmount(0);
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
      <button type="submit">Add Transaction</button>
    </form>
  );
}