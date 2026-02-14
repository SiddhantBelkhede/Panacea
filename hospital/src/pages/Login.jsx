import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hospitalAPI } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    address: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (isRegistering) {
        await hospitalAPI.register(formData);
        toast.success('Registration successful! Please login.');
        setIsRegistering(false);
        return;
      } else {
        const res = await hospitalAPI.login({
          email: formData.email,
          password: formData.password,
        });
        data = res.data;
        login(data); // Save user to context
        toast.success(`Welcome back, ${data.name}!`);
        navigate('/'); // Redirect to dashboard
      }
    } catch (error) {
      // Error handled by Axios interceptor
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#ecf0f1',
      }}
    >
      <div className="card" style={{ width: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isRegistering ? 'Hospital Registration' : 'Hospital Login'}
        </h2>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label>Hospital Name</label>
                <input name="name" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" onChange={handleChange} required />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            cursor: 'pointer',
            color: '#007bff',
          }}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? 'Already have an account? Login'
            : 'Need an account? Register here'}
        </p>
      </div>
    </div>
  );
};

export default Login;
