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

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
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
            headerTitle: "Thêm quảng cáo mới",
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
        return false
    };
    const handleImageSelected = (hasSelectedImage: boolean) => {
        setHasImage(hasSelectedImage);
    };

    const onSubmit= async  (data: ICreateAdvertisement) => {
        try {
            const result = await imagePickerRef.current?.upload();
            if (!result?.secure_url) {
                console.error("Image upload failed");
                return;
            }
            const finalData = {
                ...data,
                imageUrl: result.secure_url,
            };
            await callAdvertisementApi(async () => {
                const response = await apiService.post('/advertisements', finalData);
                console.log(response.data);
                console.log("Them quang cao thanh cong")
            });
        } catch (err) {
            console.error('Lỗi upload:', err);
        }
    }
    if(advertisementLoading) {
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
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Mô tả quảng cáo</Text>
                                <Controller
                                    control={control}
                                    name="description"
                                    rules={{ required: "Mô tả là bắt buộc" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Nhập mô tả"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
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
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Hình ảnh*</Text>
                                <ImagePickerPreview
                                    ref={imagePickerRef}
                                    onImageSelected={handleImageSelected}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
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