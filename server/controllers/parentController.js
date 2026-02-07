import Child from '../models/Child.js';

// POST api/parent/login
export const loginParent = async (req, res) => {
  const { uniqueCode, dob } = req.body;

  try {
    // 1. Find child by unique ID
    const child = await Child.findOne({ uniqueCode });

    if (!child) {
      return res
        .status(401)
        .json({ message: 'Invalid Code. Please check and try again.' });
    }

    // 2. Verify Date of Birth
    // Here I took date string as (YYYY/MM/DD) to avoid timezone issues
    const inputDate = new Date(dob).toISOString().split('T')[0];
    const storedDate = new Date(child.dob).toISOString().split('T')[0];

    if (inputDate !== storedDate) {
      return res
        .status(401)
        .json({ message: 'Date of birth does not match our records.' });
    }

    // 3. Login Successful - Return child data
    res.json({
      message: 'Login Successful',
      child: child,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
