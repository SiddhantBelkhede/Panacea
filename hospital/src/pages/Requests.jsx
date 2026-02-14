import React, { useState, useEffect } from 'react';
import { hospitalAPI, childAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleDate, setRescheduleDate] = useState({});

  const fetchRequests = async () => {
    try {
      const res = await hospitalAPI.getRequests(user.hospitalId);
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (request, action) => {
    try {
      const newDate =
        action === 'reschedule' ? rescheduleDate[request.appointmentId] : null;
      if (action === 'reschedule' && !newDate)
        return toast.error('Select a date first');

      await childAPI.updateStatus({
        childId: request.childId,
        appointmentId: request.appointmentId,
        status: 'Pending', // Confirmed/Scheduled
        newDate: newDate,
      });

      toast.success(action === 'confirm' ? 'Confirmed!' : 'Rescheduled!');
      fetchRequests(); // Refresh list
    } catch (error) {}
  };

  return (
    <div>
      <h2>Appointment Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {requests.map((req) => (
            <div
              key={req.appointmentId}
              className="card"
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <div>
                <h3>
                  {req.childName} <small>({req.uniqueCode})</small>
                </h3>
                <p>
                  <strong>Request:</strong> {req.vaccineName}
                </p>
                <p>
                  <strong>Preferred Date:</strong>{' '}
                  {new Date(req.dueDate).toLocaleDateString()}
                </p>
                <p>
                  <i>"{req.notes}"</i>
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  minWidth: '200px',
                }}
              >
                <button
                  className="btn-primary"
                  onClick={() => handleAction(req, 'confirm')}
                  style={{ backgroundColor: '#27ae60' }}
                >
                  Confirm Date
                </button>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input
                    type="date"
                    onChange={(e) =>
                      setRescheduleDate({
                        ...rescheduleDate,
                        [req.appointmentId]: e.target.value,
                      })
                    }
                  />
                  <button
                    className="btn-secondary"
                    onClick={() => handleAction(req, 'reschedule')}
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
