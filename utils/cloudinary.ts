import axios from 'axios';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';

// Get Cloudinary configuration from different sources
// Try to get from Expo Constants first, then environment variables, then fallback to hardcoded values
const expoConfig = Constants.expoConfig || {};
const cloudinaryConfig = (expoConfig as any)?.extra?.cloudinary || {};

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || cloudinaryConfig.cloudName || '';
const CLOUDINARY_API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || cloudinaryConfig.apiKey || '';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
const UPLOAD_PRESET = cloudinaryConfig.uploadPreset || 'hachiko_uploads'; // You can create a preset in your Cloudinary dashboard

// Get cloudinary upload URL
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload an image to Cloudinary
 * @param {string} imageUri - The local URI of the image to upload
 * @param {string} folder - Optional folder name to organize uploads
 * @returns {Promise<object>} - The Cloudinary upload response
 */
export const uploadImage = async (imageUri: string, folder = 'hachiko'): Promise<any> => {
  try {
    // First convert the image to base64
    const base64 = await convertImageToBase64(imageUri);
    if (!base64) throw new Error('Failed to convert image to base64');

    // Create form data for upload
    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64}`);
    
    // Use API key + signature authentication (doesn't require preset)
    const timestamp = Math.floor(Date.now() / 1000).toString();
    formData.append('timestamp', timestamp);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    
    // Generate signature for authenticated uploads
    const signParams: Record<string, string> = {
      timestamp,
    };
    
    // Add folder to signature if provided
    if (folder) {
      formData.append('folder', folder);
      signParams.folder = folder;
    }
    
    const signature = await generateSignature(signParams);
    formData.append('signature', signature);

    console.log('Cloudinary request details:', {
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY && CLOUDINARY_API_KEY.substring(0, 5) + '...',
      folder: folder,
      timestamp: timestamp,
      signature_length: signature?.length,
    });

    // Upload to Cloudinary
    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Cloudinary response error:', error.response?.data || error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Get the URL for an image from Cloudinary with optional transformations
 * @param {string} publicId - The public ID of the image
 * @param {object} options - Transformation options
 * @returns {string} - The Cloudinary image URL
 */
export const getImageUrl = (publicId: string, options: any = {}): string => {
  if (!publicId) return '';

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  let transformations = `f_${format},q_${quality}`;
  
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (crop) transformations += `,c_${crop}`;

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

/**
 * Convert a local image URI to base64
 * @param {string} uri - The local URI of the image
 * @returns {Promise<string>} - The base64 string
 */
const convertImageToBase64 = async (uri: string): Promise<string | null> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<object>} - The Cloudinary deletion response
 */
export const deleteImage = async (publicId: string): Promise<any> => {
  try {
    // Calculate signature (required for secure API calls)
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await generateSignature({
      public_id: publicId,
      timestamp,
    });

    const formData = new FormData();
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, 
      formData
    );

    return response.data;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

/**
 * Generate a signature for Cloudinary API calls
 * @param {object} params - Parameters to include in the signature
 * @returns {string} - The generated signature
 */
const generateSignature = async (params: Record<string, string>): Promise<string> => {
  // Sort parameters alphabetically and concatenate them as key=value pairs
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  
  // Append API secret
  const stringToSign = sortedParams + CLOUDINARY_API_SECRET;
  
  // Create SHA-1 hash using expo-crypto
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    stringToSign
  );
  
  return digest;
}; 