const API_URL = 'http://localhost:5000/api/parent';

export const loginParent = async (uniqueCode, dob) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uniqueCode, dob }),
    });
    
    return await response.json();
  } catch (error) {
    return { message: 'Network error: Unable to reach server' };
  }
};
