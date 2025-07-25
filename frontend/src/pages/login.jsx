// src/pages/login.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import logo from '../assets/logo.png';
import axios from 'axios';


function Login({ setIsLoggedIn, setMe }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({})
    try {
      await axios.post('/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      const meRes = await axios.get('/api/auth/users/me', { withCredentials: true });
      setMe(meRes.data);
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err.response?.data?.error || "Login failed." });
    }
  };


  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <img src={logo} alt="Fit Factor Logo" className="login-logo" />
        <h2 className="login-title">Login</h2>

        {errors.form && <Alert variant="danger">{errors.form}</Alert>}

        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="login-button">
            Login
          </Button>

          <p className="mt-3 text-center">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default Login;
