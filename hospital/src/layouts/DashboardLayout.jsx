import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaBaby,
  FaSyringe,
  FaClipboardList,
  FaSignOutAlt,
} from 'react-icons/fa';
import '../App.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: isActive ? '#fff' : '#ccc',
    backgroundColor: isActive ? '#007bff' : 'transparent',
    textDecoration: 'none',
    marginBottom: '5px',
    borderRadius: '8px',
    transition: 'background 0.3s',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#fff' }}>Panacea</h2>
          <small style={{ color: '#bdc3c7' }}>Hospital Portal</small>
        </div>

        <nav style={{ flex: 1 }}>
          <NavLink to="/" style={navItemStyle} end>
            <FaHome style={{ marginRight: '10px' }} /> Overview
          </NavLink>
          <NavLink to="/register-patient" style={navItemStyle}>
            <FaBaby style={{ marginRight: '10px' }} /> Register Newborn
          </NavLink>
          <NavLink to="/records" style={navItemStyle}>
            <FaSyringe style={{ marginRight: '10px' }} /> Update Records
          </NavLink>
          <NavLink to="/requests" style={navItemStyle}>
            <FaClipboardList style={{ marginRight: '10px' }} /> Appointment
            Requests
          </NavLink>
        </nav>

        <div style={{ borderTop: '1px solid #444', paddingTop: '20px' }}>
          <div
            style={{ marginBottom: '10px', fontSize: '14px', color: '#bdc3c7' }}
          >
            Logged in as: <br /> <strong>{user?.name}</strong>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '10px',
              background: '#c0392b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <FaSignOutAlt style={{ marginRight: '10px' }} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          backgroundColor: '#f4f6f8',
          padding: '30px',
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
