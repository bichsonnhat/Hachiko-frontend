import axios from 'axios';
import { API_BASE_URL, API_KEY } from '@env';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-KEY': API_KEY,
    'Content-Type': 'application/json',
  },
});

export default apiService;