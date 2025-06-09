import {
    View, Image, Text, TouchableOpacity, TextInput, Pressable,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRouter} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePickerPreview, {ImagePickerPreviewRef} from "@/components/common/ImagePickerPreview";
import apiService from "@/constants/config/axiosConfig";
import {INotification} from '@/constants/interface/notification.interface';
import {useApi} from "@/hooks/useApi";

export default function AddNotification() {
    const router = useRouter()
    const navigation = useNavigation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [publishDate, setPublishDate] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [image, setImage] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);
    const [hasImage, setHasImage] = useState(false);
    const {
        loading: notificationLoading,
        errorMessage: notificationErrorMessage,
        callApi: callNotificationApi,
    } = useApi<void>();
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Thêm thông báo mới",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    };
    const isSubmitDisabled = (): boolean => {
        return !title.trim() || !description.trim() || !publishDate || !hasImage;
    };
    const handleImageSelected = (hasSelectedImage: boolean) => {
        setHasImage(hasSelectedImage);
    };
    const onChange = ({type}: { type: string }, selectedDate?: Date) => {
        if (type === "set" && selectedDate) {
            setDate(selectedDate);
            if (Platform.OS === "android") {
                toggleDatePicker();
                setPublishDate(formatDate(selectedDate));
            }
        } else {
            toggleDatePicker();
        }
    };

    const confirmIOSDate = () => {
        setPublishDate(formatDate(date));
        toggleDatePicker();
    };

    const formatDate = (rawDate: Date) => {
        let date = new Date(rawDate);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        let day = date.getDate().toString().padStart(2, "0");
        return `${day}-${month}-${year}`;
    };

    async function handleSubmit() {
        try {
            const result = await imagePickerRef.current?.upload();
            if (result) {
                console.log('Upload thành công:', result.secure_url);
                const notificationData:Omit<INotification,'id'>= {
                    title: title,
                    description: description,
                    imageUrl: result.secure_url,
                    date: publishDate
                }
                console.log('Notification data:', notificationData);
                await callNotificationApi(async () => {
                    const response = await apiService.post('/notifications', notificationData);
                    console.log('Thêm thông báo thành công:', response.data);
                });
                setTitle('');
                setDescription('');
                setPublishDate('');
                setHasImage(false);
                imagePickerRef.current?.reset();
                Alert.alert("Thành công", "Thông báo đã được tạo thành công!", [
                    { text: "OK", onPress: () => router.back() }
                ]);
            }
        } catch (err) {
            console.error('Lỗi upload:', err);
        }
    }
    if(notificationLoading) {
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
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên thông
                                    báo*</Text>
                                <TextInput
                                    placeholder="Nhập tên thông báo"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={title}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setTitle}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Mô tả*</Text>
                                <TextInput
                                    placeholder="Nhập mô tả"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={description}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setDescription}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Ngày thông
                                    báo*</Text>
                                {showPicker && (
                                    <DateTimePicker
                                        mode="date"
                                        display="spinner"
                                        value={date}
                                        onChange={onChange}
                                        className="h-[120px] mt-[-10px]"
                                    />
                                )}

                                {showPicker && Platform.OS === "ios" && (
                                    <View className="flex-row justify-around">
                                        <TouchableOpacity
                                            className="bg-[#11182711] h-[50px] justify-center items-center rounded-[50px] mt-[10px] mb-[15px] px-[20px]"
                                            onPress={toggleDatePicker}
                                        >
                                            <Text className="text-[#E47905] text-[14px] font-medium">Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="h-[50px] justify-center items-center rounded-[50px] mt-[10px] mb-[15px] px-[20px]"
                                            onPress={confirmIOSDate}
                                        >
                                            <Text className="text-[#fff] text-[14px] font-medium">Confirm</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {!showPicker && (
                                    <Pressable onPress={toggleDatePicker}>
                                        <TextInput
                                            placeholder="08-06-2004"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            editable={false}
                                            value={publishDate}
                                            onPressIn={toggleDatePicker}
                                        />
                                    </Pressable>
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