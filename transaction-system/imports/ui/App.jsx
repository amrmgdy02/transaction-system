import React from 'react';
import { useState, Fragment } from 'react';
import { LoginForm } from './LoginForm.jsx';
import { RegistrationForm } from './RegistrationForm.jsx';
import { TransactionsCollection } from '../api/transaction.js';
const { useTracker, useSubscribe } = require('meteor/react-meteor-data');

export const App = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const isLoading = useSubscribe('transactions');
  const user=useTracker(() => Meteor.user());
    const logout= () =>   Meteor.logout();

  const transactions = useTracker(() => {
    if (!user) {
      return [];
    }
    return TransactionsCollection.find({}).fetch();
  }, []);
  const handleDelete= ({ _id }) =>
    Meteor.callAsync("tasks.delete", { _id });
  if (isLoading()) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
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
};
