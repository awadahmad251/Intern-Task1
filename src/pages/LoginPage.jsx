import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import loginImage from '../assets/login-image.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real application, you would have authentication logic here
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image">
          <img src={loginImage} alt="Shopping" />
        </div>
        <div className="login-form">
          <h2>Karyana</h2>
          <h3>Admin Login</h3>
          <p>Please enter the credentials associated with your account.</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input type="email" placeholder="Email Address" />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;