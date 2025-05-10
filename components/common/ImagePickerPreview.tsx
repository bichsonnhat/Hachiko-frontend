import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import useCloudinary from '@/hooks/useCloudinary';

export type ImagePickerPreviewRef = {
    upload: () => Promise<any | null>;
    getLocalUri: () => string | null;
    reset: () => void;
};

type Props = {
    initialUri?: string;
    onImageSelected?: (hasImage: boolean) => void;
};

const ImagePickerPreview = forwardRef<ImagePickerPreviewRef, Props>(({ initialUri, onImageSelected }, ref) => {
    const [imageUri, setImageUri] = useState<string | null>(initialUri || null);

    const {
        uploadImageFromUri,
        isUploading,
        uploadProgress,
        uploadError,
    } = useCloudinary();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
            if (onImageSelected) {
                onImageSelected(true);
            }
        }
    };

    useImperativeHandle(ref, () => ({
        upload: async () => {
            if (!imageUri) return null;
            return await uploadImageFromUri(imageUri, { folder: 'hachiko/category' });
        },
        getLocalUri: () => imageUri,
        reset: () => {
            setImageUri(null);
            if (onImageSelected) {
                onImageSelected(false);
            }
        },
    }));

    return (
        <View className="mt-3 relative">
            <View className="flex-row relative">
                <TouchableOpacity onPress={pickImage}>
                    {!imageUri ? (
                        <Image
                            source={require('@/assets/images/Profile/camera.png')}
                            className="w-[150px] h-[150px]"
                        />
                    ) : (
                        <Image
                            source={{ uri: imageUri }}
                            className="w-[150px] h-[150px] rounded-2xl"
                        />
                    )}
                </TouchableOpacity>

                {imageUri && (
                    <TouchableOpacity
                        onPress={() => {
                            setImageUri(null);
                            if (onImageSelected) {
                                onImageSelected(false);
                            }
                        }}
                        className="absolute top-0 bg-black/60 rounded-full p-2"
                    >
                        <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            {isUploading && (
                <View className="flex-row items-center mt-2">
                    <Text className="text-blue-500">{Math.round(uploadProgress * 100)}%</Text>
                </View>
            )}

            {uploadError && (
                <Text className="text-red-500 mt-2 text-center">{uploadError}</Text>
            )}
        </View>
    );
});

export default ImagePickerPreview;
