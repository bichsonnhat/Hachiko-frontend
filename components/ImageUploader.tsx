import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCloudinary from '../hooks/useCloudinary';

type ImageUploaderProps = {
  onImageUploaded?: (imageData: any) => void;
  initialImageUrl?: string;
  folder?: string;
  aspect?: [number, number];
  width?: number;
  height?: number;
  placeholder?: string;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  initialImageUrl,
  folder = 'hachiko',
  aspect = [1, 1],
  width = 200,
  height = 200,
  placeholder = 'Upload Image',
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  
  const {
    pickAndUploadImage,
    takePhotoAndUpload,
    removeImage,
    isUploading,
    uploadProgress,
    uploadError,
  } = useCloudinary();

  // Handler for picking image from gallery
  const handlePickImage = async () => {
    const result = await pickAndUploadImage({ folder, aspect });
    
    if (result) {
      setImageUrl(result.secure_url);
      setImagePublicId(result.public_id);
      onImageUploaded?.(result);
    }
  };

  // Handler for taking photo with camera
  const handleTakePhoto = async () => {
    const result = await takePhotoAndUpload({ folder, aspect });
    
    if (result) {
      setImageUrl(result.secure_url);
      setImagePublicId(result.public_id);
      onImageUploaded?.(result);
    }
  };

  // Handler for removing the image
  const handleRemoveImage = async () => {
    if (imagePublicId) {
      await removeImage(imagePublicId);
      setImageUrl(null);
      setImagePublicId(null);
      onImageUploaded?.(null);
    }
  };

  // Render upload progress
  const renderProgress = () => {
    if (!isUploading) return null;
    
    const progressPercentage = Math.round(uploadProgress * 100);
    
    return (
      <View style={styles.progressContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.progressText}>{progressPercentage}%</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, { width, height }]}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
            <Ionicons name="close-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.placeholder, { width, height }]}>
          <Text style={styles.placeholderText}>{placeholder}</Text>
          {renderProgress()}
        </View>
      )}

      {!imageUrl && !isUploading && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
            <Ionicons name="images" size={24} color="white" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>
      )}

      {uploadError && (
        <Text style={styles.errorText}>{uploadError}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ImageUploader; 