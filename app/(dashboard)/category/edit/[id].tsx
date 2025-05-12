import {
    View, Image, Text, TouchableOpacity, TextInput,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
    Switch,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useLocalSearchParams, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useApi } from '@/hooks/useApi';
import apiService from '@/constants/config/axiosConfig';
import ImagePickerPreview, { ImagePickerPreviewRef } from '@/components/common/ImagePickerPreview';

export default function UpdateCategory() {

    const { id } = useLocalSearchParams();

    const navigation = useNavigation();
    const [categoryName, setCategoryName] = useState("");
    const [hasTopping, setHasTopping] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [hasImage, setHasImage] = useState(false);
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);
    const [originalData, setOriginalData] = useState({
        name: '',
        hasToppings: false,
        imgUrl: '',
    });

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Sửa thông tin danh mục`,
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);

    const {
        loading: getCategoryLoading,
        errorMessage: getCategoryErrorMessage,
        callApi: getCategoryApi,
    } = useApi<void>();

    const {
        loading: updateCategoryLoading,
        errorMessage: updateCategoryErrorMessage,
        callApi: updateCategoryApi,
    } = useApi<void>();

    const fetchCategoryData = async () => {
        await getCategoryApi(async () => {
            const { data } = await apiService.get(`/categories/${id}`);

            setCategoryName(data.name);
            setHasTopping(data.hasToppings);
            setImageUri(data.imgUrl);
            setHasImage(!!data.imgUrl);

            setOriginalData({
                name: data.name,
                hasToppings: data.hasToppings,
                imgUrl: data.imgUrl,
            });
        });
    };

    const isSubmitDisabled = (): boolean => {
        const nameUnchanged = categoryName.trim() === originalData.name;
        const toppingUnchanged = hasTopping === originalData.hasToppings;
        const imageUnchanged = imageUri === originalData.imgUrl;

        const noChange = nameUnchanged && toppingUnchanged && imageUnchanged;
        const invalidInput = !categoryName.trim() || !hasImage;

        return invalidInput || noChange;
    };

    const handleImageSelected = (hasSelectedImage: boolean) => {
        setHasImage(hasSelectedImage);
    };

    const handleSubmit = async () => {
        try {
            let uploadedImageUrl = originalData.imgUrl;

            if (isSubmitDisabled()) {
                const result = await imagePickerRef.current?.upload();
                if (result) {
                    console.log('Upload thành công:', result.secure_url);
                    uploadedImageUrl = result.secure_url;
                } else {
                    console.warn('Không thể upload hình ảnh');
                    return;
                }
            }

            const categoryData = {
                id: id,
                name: categoryName.trim(),
                hasToppings: hasTopping,
                imgUrl: uploadedImageUrl,
            };

            await updateCategoryApi(async () => {
                await apiService.put(`/categories`, categoryData);
            });

            setOriginalData(categoryData);
            // imagePickerRef.current?.reset();
            console.log('Cập nhật thành công');
            router.back();

            router.replace({
                pathname: "/(dashboard)/category",
                params: {
                    updatedCategory: JSON.stringify(categoryData),
                },
            });
        } catch (err) {
            console.error('Lỗi upload hoặc update:', err);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, []);

    if (getCategoryLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#f59e0b" />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 bg-white"
            >
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                >
                    <View className="py-0 px-7">
                        <View>
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
                                initialUri={imageUri}
                            />
                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 20 }}>
                                <Icon name="trash-can-outline" size={20} color="red" />
                                <Text style={{ color: "red", marginLeft: 5, fontWeight: "bold" }}>
                                    Xóa danh mục này
                                </Text>
                            </TouchableOpacity>
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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}