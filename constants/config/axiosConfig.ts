import axios from 'axios';
import { getStoredToken } from '@/utils/jwt';

const apiService = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    'X-API-KEY': process.env.EXPO_PUBLIC_API_KEY,
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in requests
apiService.interceptors.request.use(
  async (config) => {
    try {
      // Get the stored token
      const token = await getStoredToken();
      
      // If token exists, add it to the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error setting auth token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiService;