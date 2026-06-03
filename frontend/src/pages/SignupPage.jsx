import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import loginImage from '../assets/login-image.png';
import { auth } from '../api/client';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await auth.signup({ name, email, password, role });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-image">
          <img src={loginImage} alt="Shopping" />
        </div>
        <div className="signup-form">
          <h2>Karyana</h2>
          <h3>Create Account</h3>
          <p>Sign up to access your dashboard.</p>
          {error && <div className="signup-error">{error}</div>}
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="user">User</option>
                <option value="sales">Sales Person</option>
                <option value="warehouse">Warehouse Manager</option>
                <option value="retailer">Retailer</option>
                <option value="coordinator">Coordinator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
          <button className="signup-link" type="button" onClick={() => navigate('/')}
            >Already have an account? Login</button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
