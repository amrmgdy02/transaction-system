import { Accounts } from "meteor/accounts-base";
import React, { useState } from "react";

export const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    Accounts.createUser({ username, password });
  };

  return (
    <form onSubmit={submit} className="registration-form">
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        placeholder="Username"
        required
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="registration-button" type="submit">Register</button>
    </form>
  );
};
