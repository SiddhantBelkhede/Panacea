import React, { useState } from 'react';
import { loginParent } from './api';
import './App.css';

function App() {
  // Initialize child state from localStorage if available
  const [child, setChild] = useState(() => {
    const savedChild = localStorage.getItem('parentChild');
    return savedChild ? JSON.parse(savedChild) : null;
  });

  const [formData, setFormData] = useState({ uniqueCode: '', dob: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginParent(formData.uniqueCode.trim(), formData.dob);

    if (result.child) {
      setChild(result.child);
      // Save child data to localStorage on successful login
      localStorage.setItem('parentChild', JSON.stringify(result.child));
    } else {
      setError(result.message || 'Login failed');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setChild(null);
    setFormData({ uniqueCode: '', dob: ''});
    // Remove data from localStorage on logout
    setFormData({ uniqueCode: '', dob: '' });
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Panacea Parent Portal</h1>
      </header>

      {!child ? (
        // Login view
        <div className="card login-card">
          <h2>Access Child Reconrds</h2>
          <p>
            Enter the Unique ID provided by the hospital and your child's Date
            of Birth
          </p>

          {error && <div className="alert error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Unique ID (e.g. PANA-XYZ123)</label>
              <input
                name="uniqueCode"
                value={formData.uniqueCode}
                onChange={handleChange}
                placeholder="Enter Code"
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Access Record'}
            </button>
          </form>
        </div>
      ) : (
        // Dashboard view
        <div className="dashboard">
          <div className="card profile-card">
            <div className="profile-header">
              <div className="avatar">👶</div>
              <div>
                <h2>{child.name}</h2>
                <span className="badge">{child.uniqueCode}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
            <div className="details-grid">
              <p>
                <strong>Parent:</strong> {child.parentName}
              </p>
              <p>
                <strong>DOB:</strong> {new Date(child.dob).toLocaleDateString()}
              </p>
              <p>
                <strong>Gender:</strong> {child.gender}
              </p>
            </div>
          </div>

          <div className="card history-card">
            <h3>Vaccination and Medical History</h3>

            {child.vaccinationHistory.length === 0 ? (
              <p className="empty-state">No records found yet.</p>
            ) : (
              <div className="timeline">
                {child.vaccinationHistory
                  .slice()
                  .reverse()
                  .map((record, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-date">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      <div className="timeline-content">
                        <h4>{record.vaccineName}</h4>
                        <p>{record.notes}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* AI placeholder for later */}
          <div className="card ai-card placeholder">
            <h3>AI Assistant</h3>
            <p>Comming soon: Ask questions about your child's history here</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
