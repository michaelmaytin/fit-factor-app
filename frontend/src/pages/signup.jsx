import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import logo from '../assets/logo.png';
import axios from 'axios';

function Signup({ setIsLoggedIn, setMe }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    height_ft: '',
    weight_lbs: '',
    goal: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.age && (parseInt(formData.age) < 0 || parseInt(formData.age) > 130)) newErrors.age = 'Enter a valid age';
    if (formData.height_ft && isNaN(parseFloat(formData.height_ft))) newErrors.height_ft = 'Height must be a number';
    if (formData.weight_lbs && isNaN(parseFloat(formData.weight_lbs))) newErrors.weight_lbs = 'Weight must be a number';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 handleSubmit fired', formData);
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSuccess(false);
      return
    }

    setErrors({});
    try {
      await axios.post('/api/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });
      setIsLoggedIn(true);
      const meRes = await axios.get('/api/auth/users/me', { withCredentials: true });
      setMe(meRes.data);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err.response?.data?.error || 'Signup failed' });
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-form-container">
        <img src={logo} alt="Fit Factor Logo" className="signup-logo" />
        <h2 className="signup-title">Sign Up</h2>

        <Form onSubmit={handleSubmit} className="signup-form">
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={formData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
              placeholder="Enter username"
            />
            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="Enter email"
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              placeholder="Enter password"
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
              placeholder="Confirm password"
            />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              isInvalid={!!errors.age}
              placeholder="Enter your age"
            />
            <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              isInvalid={!!errors.gender}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Height (ft)</Form.Label>
            <Form.Control
              name="height_ft"
              value={formData.height_ft}
              onChange={handleChange}
              isInvalid={!!errors.height_ft}
              placeholder="e.g. 5.9"
            />
            <Form.Control.Feedback type="invalid">{errors.height_ft}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Weight (lbs)</Form.Label>
            <Form.Control
              name="weight_lbs"
              value={formData.weight_lbs}
              onChange={handleChange}
              isInvalid={!!errors.weight_lbs}
              placeholder="e.g. 160"
            />
            <Form.Control.Feedback type="invalid">{errors.weight_lbs}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fitness Goal</Form.Label>
            <Form.Control
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="e.g. Lose 10 pounds, build muscle"
            />
          </Form.Group>

          <Button variant="success" type="submit" className="signup-button">
            Create Account
          </Button>
        </Form>

        {/* Success message BELOW the form */}
        {success && (
          <Alert variant="success" className="mt-3 text-center">
            Account created successfully! Loading your dashboard...
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Signup;
