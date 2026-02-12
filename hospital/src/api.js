const API_URL = "http://localhost:5000/api/hospital";
const CHILD_API_URL = "http://localhost:5000/api/child";

export const registerHospital = async (data) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { message: "Network error: Unable to reach server" };
  }
};

export const loginHospital = async (data) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { message: "Network error: Unable to reach server" };
  }
};

export const registerChild = async (data) => {
  try {
    const response = await fetch(`${CHILD_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { message: "Network error: Unable to reach server" };
  }
};

export const getChildByCode = async (code) => {
  try {
    const response = await fetch(`${CHILD_API_URL}/${code}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    return { message: "Network error" };
  }
};

export const addVaccination = async (data) => {
  try {
    const response = await fetch(`${CHILD_API_URL}/vaccinate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { message: "Network error" };
  }
};

export const scheduleVaccination = async (data) => {
  try {
    const response = await fetch(`${CHILD_API_URL}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    return { message: "Network error" };
  }
};

export const getPendingRequests = async (hospitalId) => {
  try {
    const response = await fetch(`${API_URL}/${hospitalId}/requests`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await response.json();
  } catch (error) {
    return [];
  }
};

export const updateAppointmentStatus = async (data) => {
  try {
    const response = await fetch(`${CHILD_API_URL}/update-appointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    return { message: "Network error" };
  }
};
