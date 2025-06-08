import {
    View, Image, Text, TouchableOpacity, TextInput, Pressable,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePickerPreview, {ImagePickerPreviewRef} from "@/components/common/ImagePickerPreview";
import apiService from "@/constants/config/axiosConfig";
import {INotification} from '@/constants/interface/notification.interface';
import {useApi} from "@/hooks/useApi";
import {Controller, useForm} from "react-hook-form";
import {IAdvertisement} from "@/constants/interface/advertisement.interface";

interface ICreateAdvertisement extends Omit<IAdvertisement, "id"> {}

export default function AddAdvertisement() {
    const navigation = useNavigation();
    const [description, setDescription] = useState("");
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);
    const [hasImage, setHasImage] = useState(false);
    const [imageError, setImageError] = useState("");

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
        trigger,
    } = useForm<ICreateAdvertisement>({
        defaultValues: {
            description: "",
            imageUrl: ""
        },
        mode: "onChange",
    });

    const {
        loading: advertisementLoading,
        errorMessage: advertisementErrorMessage,
        callApi: callAdvertisementApi,
    } = useApi<void>();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Thêm quảng cáo mới",
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
        return !isValid || !hasImage || advertisementLoading;
    };

    const handleImageSelected = (hasSelectedImage: boolean) => {
        setHasImage(hasSelectedImage);
        if (hasSelectedImage) {
            setImageError("");
        }
    };

    const validateForm = async (): Promise<boolean> => {
        // Trigger validation cho tất cả fields
        const isFormValid = await trigger();

        // Validate image
        if (!hasImage) {
            setImageError("Hình ảnh là bắt buộc");
            return false;
        } else {
            setImageError("");
        }

        return isFormValid;
    };

    const onSubmit = async (data: ICreateAdvertisement) => {
        try {
            // Validate form trước khi submit
            const isFormValid = await validateForm();
            if (!isFormValid) {
                return;
            }

            const result = await imagePickerRef.current?.upload();
            if (!result?.secure_url) {
                console.error("Image upload failed");
                setImageError("Không thể tải lên hình ảnh");
                return;
            }

            const finalData = {
                ...data,
                imageUrl: result.secure_url,
            };

            await callAdvertisementApi(async () => {
                const response = await apiService.post('/advertisements', finalData);
                console.log(response.data);
            });
        } catch (err) {
            console.error('Lỗi upload:', err);
        }
    };

    const handleSubmitPress = async () => {
        // Validate form trước khi gọi onSubmit
        const isFormValid = await validateForm();
        if (isFormValid) {
            handleSubmit(onSubmit)();
        }
    };

    if (advertisementLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Icon name="loading" size={24} color="#E47905" />
                <Text className="text-gray-500 mt-2">Đang tải...</Text>
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
                    contentContainerStyle={{paddingBottom: 20}}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                >
                    <View className="px-7">
                        <View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">
                                    Mô tả quảng cáo*
                                </Text>
                                <Controller
                                    control={control}
                                    name="description"
                                    rules={{
                                        required: "Mô tả là bắt buộc",
                                        minLength: {
                                            value: 10,
                                            message: "Mô tả phải có ít nhất 10 ký tự"
                                        }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Nhập mô tả quảng cáo"
                                            className={`p-[10px] border rounded-[10px] text-[16px] bg-white mt-[10px] ${
                                                errors.description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            multiline={true}
                                            numberOfLines={4}
                                            placeholderTextColor="#9ca3af"
                                        />
                                    )}
                                />
                                {errors.description && (
                                    <Text className="text-red-500 text-[14px] mt-1">
                                        {errors.description.message}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">
                                    Hình ảnh*
                                </Text>
                                <View className={`${imageError ? 'border border-red-500 rounded-[10px] p-2 mt-[10px]' : ''}`}>
                                    <ImagePickerPreview
                                        ref={imagePickerRef}
                                        onImageSelected={handleImageSelected}
                                    />
                                </View>
                                {imageError && (
                                    <Text className="text-red-500 text-[14px] mt-1">
                                        {imageError}
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmitPress}
                                disabled={isSubmitDisabled()}
                                className={`py-4 px-5 rounded-[10px] items-center mt-[20px] ${
                                    isSubmitDisabled() ? 'bg-gray-200' : 'bg-[#f59e0b]'
                                }`}
                            >
                                <Text
                                    className={`text-[16px] font-bold ${
                                        isSubmitDisabled() ? 'text-gray-500' : 'text-white'
                                    }`}
                                >
                                    {advertisementLoading ? 'Đang xử lý...' : 'Xong'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}