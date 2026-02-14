import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Overview = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50' }}>
          Welcome, {user?.name}
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
          What would you like to do today?
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '30px',
          }}
        >
          <Link
            to="/register-patient"
            className="btn-primary"
            style={{ textDecoration: 'none', padding: '15px 30px' }}
          >
            Register New Child
          </Link>
          <Link
            to="/requests"
            className="btn-secondary"
            style={{
              textDecoration: 'none',
              padding: '15px 30px',
              background: '#fff',
              border: '1px solid #ccc',
            }}
          >
            View Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;
