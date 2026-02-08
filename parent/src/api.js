const API_URL = 'http://localhost:5000/api/parent';
const AI_URL = 'http://localhost:8000';

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

export const askAI = async (historyContext, userQuestion) => {
  try {
    const response = await fetch(`${AI_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history_context: historyContext,
        user_question: userQuestion,
      }),
    });

    return await response.json();
  } catch (error) {
    return {
      answer: 'Error: Unable to reach AI service. Is the Python server running?',
    };
  }
};