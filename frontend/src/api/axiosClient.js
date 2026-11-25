import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the token to every request if it exists
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;