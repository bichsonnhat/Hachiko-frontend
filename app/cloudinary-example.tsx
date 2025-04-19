import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import ImageUploader from '../components/ImageUploader';

export default function CloudinaryExampleScreen() {
  const [uploadedImage, setUploadedImage] = useState<any>(null);

  const handleImageUploaded = (imageData: any) => {
    setUploadedImage(imageData);
    console.log('Image uploaded:', imageData);
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Cloudinary Image Upload' }} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Upload an Image</Text>
        <Text style={styles.description}>
          Use the component below to upload an image to Cloudinary using the camera or gallery
        </Text>
        
        <View style={styles.uploaderContainer}>
          <ImageUploader 
            onImageUploaded={handleImageUploaded}
            folder="hachiko_demo"
            width={300}
            height={300}
            placeholder="Tap to upload an image"
          />
        </View>
        
        {uploadedImage && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Upload Result:</Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>URL: </Text>
              {uploadedImage.secure_url}
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Format: </Text>
              {uploadedImage.format}
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Size: </Text>
              {uploadedImage.bytes} bytes
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Dimensions: </Text>
              {uploadedImage.width} x {uploadedImage.height}
            </Text>
            <Text style={styles.resultText}>
              <Text style={styles.label}>Public ID: </Text>
              {uploadedImage.public_id}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  uploaderContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
}); 