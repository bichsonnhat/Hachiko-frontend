import axios from 'axios';

const apiService = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    'X-API-KEY': process.env.EXPO_PUBLIC_API_KEY,
    'Content-Type': 'application/json',
  },
});

export default apiService;