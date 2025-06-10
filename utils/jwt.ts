import * as jose from 'jose';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Get JWT configuration from app.json
const JWT_SECRET = Constants.expoConfig?.extra?.jwt?.secret || 'your-fallback-jwt-secret-key';
const TOKEN_EXPIRY = Constants.expoConfig?.extra?.jwt?.expiry || '7d'; // Default 7 days

// Convert time string like '7d' to seconds
const parseExpiry = (expiryString: string): number => {
  const unit = expiryString.slice(-1);
  const value = parseInt(expiryString.slice(0, -1), 10);
  
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    default: return 7 * 24 * 60 * 60; // Default 7 days
  }
};

/**
 * Generate a JWT token for a user
 * @param userId - The user ID to include in the token
 * @returns A Promise that resolves to the JWT token
 */
export const generateToken = async (userId: string): Promise<string> => {
  if (!userId) {
    throw new Error('User ID is required to generate a token');
  }
  
  try {
    // Create a secret key from the JWT_SECRET
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    
    // Current time in seconds
    const now = Math.floor(Date.now() / 1000);
    
    // Calculate expiry in seconds
    const expiryInSeconds = parseExpiry(TOKEN_EXPIRY);
    
    // Create the JWT
    const token = await new jose.SignJWT({ sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + expiryInSeconds)
      .sign(secretKey);
    
    // Optionally store the token in secure storage
    await SecureStore.setItemAsync('user_token', token);
    
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw error;
  }
};

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded token payload
 */
export const verifyToken = async (token: string): Promise<any> => {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    throw error;
  }
};

/**
 * Get the stored token from secure storage
 * @returns A Promise that resolves to the stored token or null if not found
 */
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('user_token');
  } catch (error) {
    console.error('Error retrieving stored token:', error);
    return null;
  }
};

/**
 * Clear the stored token from secure storage
 * @returns A Promise that resolves when the token is cleared
 */
export const clearToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('user_token');
  } catch (error) {
    console.error('Error clearing stored token:', error);
  }
}; 