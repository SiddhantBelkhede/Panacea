import React, { useState } from 'react';
import { childAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Records = () => {
  const { user } = useAuth();
  const [searchCode, setSearchCode] = useState('');
  const [child, setChild] = useState(null);
  const [actionType, setActionType] = useState('record'); // 'record' | 'schedule'

  // Forms
  const [vaccineForm, setVaccineForm] = useState({
    vaccineName: '',
    notes: '',
  });
  const [scheduleForm, setScheduleForm] = useState({
    vaccineName: '',
    dueDate: '',
    notes: '',
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await childAPI.getByCode(searchCode.trim());
      setChild(res.data);
      toast.success('Child found');
    } catch (error) {
      setChild(null);
    }
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...vaccineForm,
        uniqueCode: child.uniqueCode,
        hospitalId: user.hospitalId,
      };
      const res = await childAPI.addVaccination(payload);
      setChild(res.data.child);
      toast.success('Vaccination recorded!');
      setVaccineForm({ vaccineName: '', notes: '' });
    } catch (error) {}
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...scheduleForm, uniqueCode: child.uniqueCode };
      const res = await childAPI.schedule(payload);
      setChild(res.data.child);
      toast.success('Scheduled successfully!');
      setScheduleForm({ vaccineName: '', dueDate: '', notes: '' });
    } catch (error) {}
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Update Records</h2>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            placeholder="Enter Unique ID (e.g. PANA-XYZ)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ width: 'auto', padding: '0 30px' }}
          >
            Search
          </button>
        </form>
      </div>

      {child && (
        <div className="fade-in">
          {/* Child Info */}
          <div
            className="card"
            style={{ borderLeft: '5px solid #007bff', marginBottom: '20px' }}
          >
            <h3>
              {child.name}{' '}
              <small style={{ fontWeight: 'normal', color: '#666' }}>
                ({child.uniqueCode})
              </small>
            </h3>
            <p>
              Parent: {child.parentName} | DOB:{' '}
              {new Date(child.dob).toLocaleDateString()}
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setActionType('record')}
              style={{ flex: 1 }}
              className={
                actionType === 'record' ? 'btn-primary' : 'btn-secondary'
              }
            >
              Record Past Vaccine
            </button>
            <button
              onClick={() => setActionType('schedule')}
              style={{ flex: 1 }}
              className={
                actionType === 'schedule' ? 'btn-primary' : 'btn-secondary'
              }
            >
              Schedule Next Dose
            </button>
          </div>

          {/* Action Form */}
          <div className="card" style={{ marginBottom: '20px' }}>
            {actionType === 'record' ? (
              <form onSubmit={handleRecordSubmit}>
                <h4>Record Completed Vaccination</h4>
                <div className="form-group">
                  <input
                    placeholder="Vaccine Name"
                    value={vaccineForm.vaccineName}
                    onChange={(e) =>
                      setVaccineForm({
                        ...vaccineForm,
                        vaccineName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    placeholder="Notes"
                    value={vaccineForm.notes}
                    onChange={(e) =>
                      setVaccineForm({ ...vaccineForm, notes: e.target.value })
                    }
                  />
                </div>
                <button className="btn-primary">Save Record</button>
              </form>
            ) : (
              <form onSubmit={handleScheduleSubmit}>
                <h4>Schedule Future Vaccination</h4>
                <div className="form-group">
                  <input
                    placeholder="Next Vaccine Name"
                    value={scheduleForm.vaccineName}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        vaccineName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    value={scheduleForm.dueDate}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        dueDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    placeholder="Instructions"
                    value={scheduleForm.notes}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
                <button className="btn-primary">Set Schedule</button>
              </form>
            )}
          </div>

          {/* History & Schedule Lists */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            <div className="card">
              <h4>Upcoming Schedule</h4>
              {child.upcomingSchedule?.map((item, i) => (
                <div
                  key={i}
                  style={{ padding: '10px', borderBottom: '1px solid #eee' }}
                >
                  <strong>{item.vaccineName}</strong> <br />
                  <small style={{ color: 'orange' }}>
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
            <div className="card">
              <h4>Vaccination History</h4>
              {child.vaccinationHistory?.map((item, i) => (
                <div
                  key={i}
                  style={{ padding: '10px', borderBottom: '1px solid #eee' }}
                >
                  <strong>{item.vaccineName}</strong> <br />
                  <small style={{ color: 'green' }}>
                    Given: {new Date(item.date).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
