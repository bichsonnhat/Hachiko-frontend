import apiService from '@/constants/config/axiosConfig';
import { generateToken, verifyToken, getStoredToken, clearToken } from './jwt';

/**
 * Authentication service for managing user authentication
 */
const authService = {
  /**
   * Generate a JWT token for a user
   * @param userId - The user ID to include in the token
   * @returns A Promise that resolves to the JWT token
   */
  generateToken: async (userId: string): Promise<string> => {
    try {
      return await generateToken(userId);
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  },

  /**
   * Get a JWT token for the user, either from storage or by generating a new one
   * @param userId - The user ID to include in the token
   * @returns A Promise that resolves to the JWT token
   */
  getOrGenerateToken: async (userId: string): Promise<string> => {
    try {
      // Check if we already have a stored token
      const existingToken = await getStoredToken();
      
      if (existingToken) {
        try {
          // Verify the token is still valid
          const decoded = await verifyToken(existingToken);
          
          // Check if the token is for the correct user
          if (decoded && decoded.sub === userId) {
            return existingToken;
          }
        } catch (error) {
          // Token is invalid or expired, generate a new one
          console.log('Stored token is invalid or expired, generating a new one');
        }
      }
      
      // Generate a new token
      return await generateToken(userId);
    } catch (error) {
      console.error('Error getting or generating token:', error);
      throw error;
    }
  },

  /**
   * Verify if a user has a valid JWT token
   * @returns A Promise that resolves to true if the user has a valid token
   */
  hasValidToken: async (): Promise<boolean> => {
    try {
      const token = await getStoredToken();
      if (!token) return false;
      
      // Verify the token
      await verifyToken(token);
      return true;
    } catch (error) {
      console.error('Error verifying token validity:', error);
      return false;
    }
  },

  /**
   * Clear the stored JWT token
   * @returns A Promise that resolves when the token is cleared
   */
  logout: async (): Promise<void> => {
    try {
      await clearToken();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
};

export default authService; 