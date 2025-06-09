import {
    View, Text, TextInput, ScrollView, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity,
    Switch,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {useNavigation, useRouter} from 'expo-router';
import ImagePickerPreview, { ImagePickerPreviewRef } from '@/components/common/ImagePickerPreview';
import { useApi } from '@/hooks/useApi';
import apiService from '@/constants/config/axiosConfig';

export default function AddCategory() {
    const navigation = useNavigation();
    const [categoryName, setCategoryName] = useState('');
    const [hasTopping, setHasTopping] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);
    const router = useRouter();

    const {
        loading: categoryLoading,
        errorMessage: categoryErrorMessage,
        callApi: callCategoryApi,
    } = useApi<void>();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Thêm danh mục mới',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);

    const isSubmitDisabled = (): boolean => {
        return !categoryName.trim() || !hasImage;
    };

    const handleImageSelected = (hasSelectedImage: boolean) => {
        setHasImage(hasSelectedImage);
    };

    const handleSubmit = async () => {
        try {
            const result = await imagePickerRef.current?.upload();
            if (result) {
                console.log('Upload thành công:', result.secure_url);

                const categoryData = {
                    name: categoryName,
                    hasToppings: hasTopping,
                    imgUrl: result.secure_url,
                };

                await callCategoryApi(async () => {
                    const response = await apiService.post('/categories', categoryData);

                    console.log('Thêm danh mục thành công:', response.data);
                });
                setCategoryName('');
                setHasTopping(false);
                setHasImage(false);
                imagePickerRef.current?.reset();
                router.back();
            }
        } catch (err) {
            console.error('Lỗi upload:', err);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-white"
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                    <View className="py-0 px-7">
                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên danh mục*</Text>
                        <TextInput
                            placeholder="Nhập tên danh mục"
                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                            value={categoryName}
                            placeholderTextColor="#9ca3af"
                            onChangeText={setCategoryName}
                        />

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Topping*</Text>
                        <View className="flex-row items-center mt-[10px]">
                            <Switch
                                value={hasTopping}
                                onValueChange={setHasTopping}
                                trackColor={{ false: '#767577', true: '#f59e0b' }}
                                thumbColor={hasTopping ? '#f4f3f4' : '#f4f3f4'}
                            />
                            <Text className="ml-2 text-[16px] text-gray-600">
                                {hasTopping ? 'Có topping' : 'Không có topping'}
                            </Text>
                        </View>

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Hình ảnh*</Text>
                        <ImagePickerPreview
                            ref={imagePickerRef}
                            onImageSelected={handleImageSelected}
                        />

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isSubmitDisabled()}
                            className={`py-4 px-5 rounded-[10px] items-center mt-[20px] ${isSubmitDisabled() ? 'bg-gray-200' : 'bg-[#f59e0b]'
                                }`}
                        >
                            <Text
                                className={`text-[16px] font-bold ${isSubmitDisabled() ? 'text-gray-500' : 'text-white'
                                    }`}
                            >
                                Xong
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}