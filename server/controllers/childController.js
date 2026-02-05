import Child from '../models/Child.js';
import crypto from 'crypto';

// POST /api/child/register
export const registerChild = async (req, res) => {
  const { name, parentName, dob, gender, hospitalId } = req.body;

  try {
    // 1. Generate a unique code (Prefix 'PANA-' + 6 random hex chars)
    const uniqueCode = 'PANA-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    // 2. Create the child record
    const newChild = new Child({
      name,
      parentName,
      dob,
      gender,
      hospitalId,
      uniqueCode
    });

    await newChild.save();

    res.status(201).json({ 
      message: 'Child registered successfully', 
      uniqueCode: uniqueCode,
      childId: newChild._id 
    });

  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};