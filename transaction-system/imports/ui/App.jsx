import React from 'react';
import { useState, Fragment } from 'react';
import { LoginForm } from './LoginForm.jsx';
import { RegistrationForm } from './RegistrationForm.jsx';
const { useTracker, useSubscribe } = require('meteor/react-meteor-data');

export const App = () => {
  const [isRegistering, setIsRegistering] = useState(true);
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
