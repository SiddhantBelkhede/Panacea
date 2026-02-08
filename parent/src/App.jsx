import React, { useState } from 'react';
import { loginParent, askAI } from './api.js'; // Added .js extension
import './App.css';

function App() {
  // Initialize child state from localStorage if available
  const [child, setChild] = useState(() => {
    const savedChild = localStorage.getItem('parentChild');
    return savedChild ? JSON.parse(savedChild) : null;
  });

  // Login State
  const [formData, setFormData] = useState({ uniqueCode: '', dob: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // AI Chat State
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Format child's data into a text context for the AI
  const formatChildHistory = (childData) => {
    let context = `Child Name: ${childData.name}, Gender: ${childData.gender}, DOB: ${new Date(childData.dob).toDateString()}. `;

    if (childData.vaccinationHistory && childData.vaccinationHistory.length) {
      context += 'Vaccination History: ';
      childData.vaccinationHistory.forEach((data) => {
        context += `[Date: ${new Date(data.date).toDateString()}, Vaccine: ${data.vaccineName}, Notes: ${data.notes}]; `;
      });
    } else {
      context += 'No vaccination records found yet.';
    }

    return context;
  };

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
    setFormData({ uniqueCode: '', dob: '' });

    // Remove AI Chat
    setAiResponse('');
    setQuestion('');

    // Remove data from localStorage on logout
    localStorage.removeItem('parentChild');
  };

  // Handle question
  const handleAskAI = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    setAiLoading(true);
    setAiResponse('');

    // 1. Prepare Context
    const historyContext = formatChildHistory(child);

    // 2. Call AI Server
    const result = await askAI(historyContext, question);

    // 3. Display Result
    setAiResponse(result.answer || "Sorry, I couldn't get the answer.");
    setAiLoading(false);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Panacea Parent Portal</h1>
      </header>

      {!child ? (
        // Login view
        <div className="card login-card">
          <h2>Access Child Records</h2>
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="avatar">👶</div>
                <div>
                  <h2 style={{ margin: 0 }}>{child.name}</h2>
                  <span className="badge">{child.uniqueCode}</span>
                </div>
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

          {/* AI Chat */}
          <div className="card ai-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <span style={{ fontSize: '24px', marginRight: '10px'}}>🤖</span>
              <h3 style={{ margin: 0 }}>Ask Panacea AI</h3>
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>
              I have access to {child.name}'s medical history. Ask me anything
              about their vaccinations or health.
            </p>

            <form
              onSubmit={handleAskAI}
              style={{ display: 'flex', gap: '10px', marginTop: '15px' }}
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Is my child due for Polio vaccine?"
                style={{ flex: 1 }}
              />

              <button
                type="submit"
                className="btn-primary"
                style={{ width: 'auto', padding: '0 20px' }}
                disabled={aiLoading}
              >
                {aiLoading ? 'Thinking...' : 'Ask'}
              </button>
            </form>

            {/* AI Response Area */}
            {aiResponse && (
              <div
                className="ai-response"
                style={{
                  marginTop: '20px',
                  backgroundColor: '#f0f8ff',
                  padding: '15px',
                  borderRadius: '8px',
                  borderLeft: '4px solid #007bff',
                }}
              >
                <strong>AI Answer:</strong>
                <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>
                  {aiResponse}
                </p>
              </div>
            )}
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
          {/* <div className="card ai-card placeholder">
            <h3>AI Assistant</h3>
            <p>Comming soon: Ask questions about your child's history here</p>
          </div> */}
        </div>
      )}
    </div>
  );
}

export default App;
