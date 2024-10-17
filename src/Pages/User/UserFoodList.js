import React, { useState } from 'react';

const UserFoodList = () => {
  // State for storing email and password input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  return (
    <div className="login-container">
      <h2>Login</h2>
    </div>
  );
};

export default UserFoodList;
