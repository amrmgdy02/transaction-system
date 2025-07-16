import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useState, Fragment } from 'react';
import { LoginForm } from './LoginForm.jsx';
import { RegistrationForm } from './RegistrationForm.jsx';
import { TransactionsCollection } from '../api/transaction.js';
const { useTracker } = require('meteor/react-meteor-data');
import { Transaction } from './Transaction.jsx';
import { TransactionForm } from './TransactionForm.jsx';
import { UpdateTransactionForm } from './UpdateTransactionForm.jsx';

export const App = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [updatingTransaction, setUpdatingTransaction] = useState(null);

  const { user, transactions, isLoading, isAuthLoading } = useTracker(() => {
    const user = Meteor.user();
    const isAuthLoading = Meteor.loggingIn();
    
    if (isAuthLoading || !user) {
      return { 
        user: null, 
        transactions: [], 
        isLoading: false,
        isAuthLoading 
      };
    }

    const handle = Meteor.subscribe("transactions");
    const isLoading = !handle.ready();
    
    let transactions = [];
    if (handle.ready()) {
      transactions = TransactionsCollection.find({
        $or: [
          { senderUsername: user.username }, 
          { receiverUsername: user.username }
        ]
      }).fetch();
    }

    return { user, transactions, isLoading, isAuthLoading };
  }, []);

  const handleUpdate = (transaction) => {
    setUpdatingTransaction(transaction);
  };

  const handleSaveUpdate = () => {
    setUpdatingTransaction(null);
  };

  const handleDelete = (transaction) => {
    Meteor.callAsync("transactions.remove", transaction._id);
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Fragment>
        {isRegistering ? <RegistrationForm /> : <LoginForm />}
        <p>
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <button className="toggle-button" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <button onClick={() => Meteor.logout()}>Logout</button>
      <h1>Welcome, {user.username}!</h1>
      <TransactionForm />
      {updatingTransaction && (
        <UpdateTransactionForm
          transaction={updatingTransaction}
          onSave={handleSaveUpdate}
        />
      )}

      {isLoading ? (
        <div>Loading transactions...</div>
      ) : (
        <ul className="transactions">
          {transactions.map(transaction => (
            <Transaction
              key={transaction._id}
              transaction={transaction}
              onUpdateClick={handleUpdate}
              onDeleteClick={handleDelete}
            />
          ))}
        </ul>
      )}
    </Fragment>
  );
};