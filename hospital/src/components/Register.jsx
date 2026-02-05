import React, { useState } from 'react';
import { registerHospital } from '../api';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerHospital(formData);
    
    if (data && data.hospitalId) {
        
      setMessage('Registration Successful! Please Login.');
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } else {
      setMessage(data?.message || 'Registration failed');
    }
  };

  return (
    <div className="card">
      <h2>Register Hospital</h2>
      {message && <div className="alert">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Hospital Name:</label>
          <input name="name" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input name="email" type="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input name="password" type="password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input name="address" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-primary">Register</button>
      </form>
      <button onClick={onSwitchToLogin} className="link-btn">
        Already have an account? Login here.
      </button>
    </div>
  );
};

export default Register;