import React from 'react';

const Dashboard = ({ hospital, onLogout }) => {
  return (
    <div className="card">
      <h2>Welcome, {hospital.name}</h2>
      <p><strong>Hospital ID:</strong> {hospital.hospitalId}</p>
      <hr />
      
      <div style={{ marginTop: '20px', border: '1px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <h3>Dashboard Actions</h3>
        <p>Future features will appear here (Register Child, View Appointments)</p>
      </div>

      <button onClick={onLogout} style={{ marginTop: '20px' }}>Logout</button>
    </div>
  );
};

export default Dashboard;