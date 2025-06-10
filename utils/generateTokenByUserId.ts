import { generateToken } from './jwt';

/**
 * Simple utility function to generate a JWT token by user ID
 * 
 * @param userId The user ID to include in the token
 * @returns A Promise that resolves to the JWT token
 */
export const generateTokenByUserId = async (userId: string): Promise<string> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    return await generateToken(userId);
  } catch (error) {
    console.error('Failed to generate token:', error);
    throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export default generateTokenByUserId; 