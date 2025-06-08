import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage, getImageUrl, deleteImage } from '../utils/cloudinary';

/**
 * Custom hook for Cloudinary image operations
 */
export const useCloudinary = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * Pick an image from the device gallery and upload it to Cloudinary
   * @param {object} options - Upload options
   * @returns {Promise<object | null>} - The upload result or null on failure
   */
  const pickAndUploadImage = async (options: {
    folder?: string;
    allowsEditing?: boolean;
    aspect?: [number, number];
  } = {}): Promise<any | null> => {
    const {
      folder = 'hachiko',
      allowsEditing = true,
      aspect = [1, 1],
    } = options;

    try {
      // Reset states
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setUploadError('Permission to access media library was denied');
        return null;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality: 0.8,
      });

      if (result.canceled) {
        setIsUploading(false);
        return null;
      }

      // Start fake progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 0.05;
          return newProgress > 0.9 ? 0.9 : newProgress;
        });
      }, 100);

      // Upload the image
      const uploadResult = await uploadImage(result.assets[0].uri, folder);
      
      // Clear interval and set complete
      clearInterval(progressInterval);
      setUploadProgress(1);
      setIsUploading(false);
      
      return uploadResult;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      setIsUploading(false);
      return null;
    }
  };

  /**
   * Take a photo with the device camera and upload it to Cloudinary
   * @param {object} options - Upload options
   * @returns {Promise<object | null>} - The upload result or null on failure
   */
  const takePhotoAndUpload = async (options: {
    folder?: string;
    allowsEditing?: boolean;
    aspect?: [number, number];
  } = {}): Promise<any | null> => {
    const {
      folder = 'hachiko',
      allowsEditing = true,
      aspect = [1, 1],
    } = options;

    try {
      // Reset states
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        setUploadError('Permission to access camera was denied');
        return null;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality: 0.8,
      });

      if (result.canceled) {
        setIsUploading(false);
        return null;
      }

      // Start fake progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 0.05;
          return newProgress > 0.9 ? 0.9 : newProgress;
        });
      }, 100);

      // Upload the image
      const uploadResult = await uploadImage(result.assets[0].uri, folder);
      
      // Clear interval and set complete
      clearInterval(progressInterval);
      setUploadProgress(1);
      setIsUploading(false);
      
      return uploadResult;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      setIsUploading(false);
      return null;
    }
  };

  /**
   * Get a Cloudinary image URL with optional transformations
   */
  const getImage = (publicId: string, options = {}) => {
    return getImageUrl(publicId, options);
  };

  /**
   * Delete an image from Cloudinary
   */
  const removeImage = async (publicId: string) => {
    try {
      return await deleteImage(publicId);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to delete image');
      return null;
    }
  };

  /**
   * Upload a local image URI to Cloudinary
   * @param {string} uri - Local image URI
   * @param {object} options - Upload options
   * @returns {Promise<object | null>} - The upload result or null on failure
   */
  const uploadImageFromUri = async (uri: string, options: { folder?: string } = {}): Promise<any | null> => {
    const { folder = 'hachiko' } = options;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      // Start fake progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 0.05;
          return newProgress > 0.9 ? 0.9 : newProgress;
        });
      }, 100);

      // Upload image
      const result = await uploadImage(uri, folder);

      clearInterval(progressInterval);
      setUploadProgress(1);
      setIsUploading(false);
      return result;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      setIsUploading(false);
      return null;
    }
  };

  return {
    pickAndUploadImage,
    takePhotoAndUpload,
    getImage,
    removeImage,
    isUploading,
    uploadProgress,
    uploadError,
    uploadImageFromUri
  };
};

export default useCloudinary; 