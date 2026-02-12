import Child from '../models/Child.js';
import crypto from 'crypto';

// POST /api/child/register
export const registerChild = async (req, res) => {
  const { name, parentName, dob, gender, hospitalId } = req.body;

  try {
    // 1. Generate a unique code (Prefix 'PANA-' + 6 random hex chars)
    const uniqueCode =
      'PANA-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    // 2. Create the child record
    const newChild = new Child({
      name,
      parentName,
      dob,
      gender,
      hospitalId,
      uniqueCode,
    });

    await newChild.save();

    res.status(201).json({
      message: 'Child registered successfully',
      uniqueCode: uniqueCode,
      childId: newChild._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// GET /api/child/:code
export const getChildByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const child = await Child.findOne({ uniqueCode: code });

    if (!child) {
      return res.status(404).json({ message: 'Child not found with this ID' });
    }

    res.json(child);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// POST /api/child/vaccinate
export const addVaccinationRecord = async (req, res) => {
  const { uniqueCode, vaccineName, notes, hospitalId } = req.body;

  try {
    const child = await Child.findOne({ uniqueCode });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    const newRecord = {
      vaccineName,
      notes,
      hospitalId,
      date: new Date(),
    };

    child.vaccinationHistory.push(newRecord);
    await child.save();

    res.json({ message: 'Record updated successfully', child });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// POST /api/child/schedule
export const scheduleVaccination = async (req, res) => {
  const { uniqueCode, vaccineName, dueDate, notes } = req.body;

  try {
    const child = await Child.findOne({ uniqueCode });
    if (!child) return res.status(404).json({ message: 'Child not found' });

    child.upcomingSchedule.push({
      vaccineName,
      dueDate: new Date(dueDate),
      notes,
    });

    await child.save();
    res.json({ message: 'Scheduled successfully', child });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: err.message });
  }
};

// POST /api/child/request-appointment
export const requestAppointment = async (req, res) => {
  const { uniqueCode, vaccineName, requestedDate, notes } = req.body;

  try {
    const child = await Child.findOne({ uniqueCode });
    if (!child) return res.status(404).json({ message: 'Child not found' });

    child.upcomingSchedule.push({
      vaccineName: vaccineName,
      dueDate: new Date(requestedDate),
      status: 'Requested',
      notes: notes || '',
    });

    await child.save();
    res.json({ message: 'Appointment requested successfully', child });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const { childId, appointmentId, status, newDate } = req.body;

  try {
    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ message: 'Child not found' });

    // Find the specific appointment in the array
    const appointment = child.upcomingSchedule.id(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: 'Appointment not found' });

    // Update fields
    appointment.status = status;
    if (newDate) appointment.dueDate = new Date(newDate);

    await child.save();
    res.json({ message: 'Appointment updated', child });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
