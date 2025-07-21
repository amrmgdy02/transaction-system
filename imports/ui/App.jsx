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
import { useEffect } from 'react';

export const App = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [updatingTransaction, setUpdatingTransaction] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [oldUserName, setOldUserName] = useState('');
  const [newUsernameForUpdate, setNewUsernameForUpdate] = useState('');

  const { user, transactions, isLoading, isAuthLoading, userBalances } = useTracker(() => {
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
    let userBalances = [];
    if (handle.ready()) {
      transactions = TransactionsCollection.find({}).fetch();
      const allUsernames = new Set();
      transactions.forEach(transaction => {
        allUsernames.add(transaction.senderUsername);
        allUsernames.add(transaction.receiverUsername);
      });
      const uniqueUsernames = Array.from(allUsernames);
      
      userBalances = uniqueUsernames.map(username => {
        const totalReceived = transactions
          .filter(t => t.receiverUsername === username)
          .reduce((sum, t) => sum + t.amount, 0);
          
        const totalSent = transactions
          .filter(t => t.senderUsername === username)
          .reduce((sum, t) => sum + t.amount, 0);
          
        return {
          username: username,
          balance: totalReceived - totalSent,
          totalReceived: totalReceived,
          totalSent: totalSent
        };
      });
    }

    return { user, transactions, isLoading, isAuthLoading, userBalances };
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
      <div className="auth-container">
        {isRegistering ? <RegistrationForm /> : <LoginForm />}
        <p style={{ marginTop: '20px', color: '#666' }}>
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <button className="toggle-button" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="welcome-title">Transaction System</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#4c63d2', fontWeight: '600' }}>Welcome, {user.username}!</span>
          <button className="logout-btn" onClick={() => Meteor.logout()}>Logout</button>
        </div>
      </header>

      <div className="form-section">
        <h2>Add New User</h2>
        <div className="add-user-form">
          <input
            type="text"
            placeholder="Enter new username"
            value={newUserName}
            onChange={(e) => setNewUserName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newUserName.trim()) {
                Meteor.callAsync('transactions.addUser', newUserName.trim());
                setNewUserName('');
              }
            }}
          />
          <button 
            className="add-user-button" 
            onClick={() => {
              if (newUserName.trim()) {
                Meteor.callAsync('transactions.addUser', newUserName.trim());
                setNewUserName('');
              }
            }}
          >
            Add User
          </button>
        </div>
      </div>

      <div className="form-section">
        <h2>Update User</h2>
        <div className="update-user-form">
          <input
            type="text"
            placeholder="Current Username"
            value={oldUserName}
            onChange={(e) => setOldUserName(e.currentTarget.value)}
          />
          <input
            type="text"
            placeholder="New Username"
            value={newUsernameForUpdate}
            onChange={(e) => setNewUsernameForUpdate(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && oldUserName.trim() && newUsernameForUpdate.trim()) {
                Meteor.callAsync('transactions.updateUser', oldUserName.trim(), newUsernameForUpdate.trim())
                  .then((result) => {
                    console.log('User updated successfully:', result);
                    alert(`Updated ${result.totalUpdated} transactions for user ${oldUserName}`);
                    setOldUserName('');
                    setNewUsernameForUpdate('');
                  })
                  .catch((error) => {
                    console.error('Error updating user:', error);
                    alert('Error updating user: ' + error.message);
                  });
              }
            }}
          />
          <button 
            className="update-user-button" 
            onClick={() => {
              if (oldUserName.trim() && newUsernameForUpdate.trim()) {
                Meteor.callAsync('transactions.updateUser', oldUserName.trim(), newUsernameForUpdate.trim())
                  .then((result) => {
                    console.log('User updated successfully:', result);
                    alert(`Updated ${result.totalUpdated} transactions for user ${oldUserName}`);
                    setOldUserName('');
                    setNewUsernameForUpdate('');
                  })
                  .catch((error) => {
                    console.error('Error updating user:', error);
                    alert('Error updating user: ' + error.message);
                  });
              } else {
                alert('Please fill in both username fields');
              }
            }}
          >
            Update User
          </button>
        </div>
      </div>

      <TransactionForm />
      
      {updatingTransaction && (
        <UpdateTransactionForm
          transaction={updatingTransaction}
          onSave={handleSaveUpdate}
        />
      )}

      {isLoading ? (
        <div className="loading">Loading transactions...</div>
      ) : (
        <Fragment>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#4c63d2', marginBottom: '20px' }}>Recent Transactions</h2>
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
          </div>

          <div className="all-user-balances">
            <h2>User Balances</h2>
            <div className="balances-grid">
              {userBalances.map(userBalance => (
                <div key={userBalance.username} className="user-balance-item">
                  <div>
                    <strong>{userBalance.username}</strong>: ${userBalance.balance.toFixed(2)}
                  </div>
                  <span className="details">
                    Received: ${userBalance.totalReceived.toFixed(2)} | 
                    Sent: ${userBalance.totalSent.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};