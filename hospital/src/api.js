// For now local host, 
const API_URL = 'http://localhost:5000/api/hospital';

export const registerHospital = async (data) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { message: 'Network error: Unable to reach server' };
  }
};

export const loginHospital = async (data) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { message: 'Network error: Unable to reach server' };
  }
};