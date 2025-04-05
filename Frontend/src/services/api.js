import axios from 'axios';

// Base URL
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// API Calls
export const createReport = async (reportData) => {
  try {
    const response = await API.post('/reports', reportData);
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
  }
};

export const getReports = async () => {
  try {
    const response = await API.get('/reports');
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
  }
};
