import React, { useState } from 'react';
import { childAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const RegisterPatient = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    dob: '',
    gender: 'Male',
  });
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await childAPI.register({
        ...formData,
        hospitalId: user.hospitalId,
      });
      setGeneratedCode(res.data.uniqueCode);
      toast.success('Child Registered Successfully!');
      setFormData({ name: '', parentName: '', dob: '', gender: 'Male' });
    } catch (error) {
      // Error handled by interceptor
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Register Newborn</h2>

      {generatedCode ? (
        <div
          className="card"
          style={{
            backgroundColor: '#ecfdf5',
            borderColor: '#a7f3d0',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <h3 style={{ color: '#065f46' }}>Registration Successful!</h3>
          <p>Please share this Unique ID with the parent:</p>
          <h1
            style={{
              fontSize: '3rem',
              color: '#059669',
              margin: '20px 0',
              fontFamily: 'monospace',
            }}
          >
            {generatedCode}
          </h1>
          <button
            onClick={() => setGeneratedCode(null)}
            className="btn-primary"
          >
            Register Another Child
          </button>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Child's Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Parent's Name</label>
              <input
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                required
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
              }}
            >
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
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
            >
              Generate ID
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterPatient;
