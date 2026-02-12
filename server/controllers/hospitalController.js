import Hospital from '../models/Hospital.js';
import Child from '../models/Child.js';

// POST /api/hospital/register
export const registerHospital = async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    // Check if hospital exists
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ message: 'Hospital already exists' });
    }

    // Create new hospital
    const newHospital = new Hospital({ name, email, password, address });
    await newHospital.save();

    res.status(201).json({
      message: 'Hospital registered successfully',
      hospitalId: newHospital._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// POST /api/hospital/login
export const loginHospital = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for hospital email
    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check password (plain text for now)
    // I don't think I will hash password in this project
    if (hospital.password !== password) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    res.json({
      message: 'Login Successful',
      hospitalId: hospital._id,
      name: hospital.name,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// GET /api/hospital/:id/requests
export const getPendingRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const children = await Child.find({
      hospitalId: id,
      'upcomingSchedule.status': 'Requested',
    });

    let requests = [];
    children.forEach((child) => {
      child.upcomingSchedule.forEach((appt) => {
        if (appt.status === 'Requested') {
          requests.push({
            childId: child._id,
            childName: child.name,
            uniqueCode: child.uniqueCode,
            parentName: child.parentName,
            appointmentId: appt._id,
            vaccineName: appt.vaccineName,
            dueDate: appt.dueDate,
            notes: appt.notes,
          });
        }
      });
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
