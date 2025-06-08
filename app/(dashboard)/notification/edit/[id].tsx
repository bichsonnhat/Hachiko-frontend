import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useLocalSearchParams, useNavigation, useRouter} from 'expo-router';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from '@react-native-community/datetimepicker';
import {useApi} from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import ImagePickerPreview, {ImagePickerPreviewRef} from "@/components/common/ImagePickerPreview";
import {INotification} from "@/constants/interface/notification.interface";

export default function UpdateNotification() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [publishDate, setPublishDate] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const [hasImage, setHasImage] = useState(false);
    const [originalData, setOriginalData] = useState<INotification>({
        id: '',
        title: '',
        description: '',
        date: '',
        imageUrl: '',
    });
    const {
        loading: getNotificationLoading,
        errorMessage: getNotificationErrorMessage,
        callApi: getNotificationApi,
    } = useApi<void>();

    const {
        loading: updateNotificationLoading,
        errorMessage: updateNotificationErrorMessage,
        callApi: updateNotificationApi,
    } = useApi<void>();
    const {
        loading: deleteNotificationLoading,
        errorMessage: deleteNotificationErrorMessage,
        callApi: deleteNotificationApi,
    } = useApi<void>();
    const fetchNotificationData = async () => {
        await getNotificationApi(async () => {
            const { data } = await apiService.get<INotification>(`/notifications/${id}`);
            setTitle(data.title);
            setDescription(data.description);
            setPublishDate(data.date);
            setImageUri(data.imageUrl);
            setDate(new Date(data.date));
            setHasImage(!!data.imageUrl);
            setOriginalData({
                id: data.id,
                title: data.title,
                description: data.description,
                date: data.date,
                imageUrl: data.imageUrl,
            })
        });
    };
    useEffect(() => {
        fetchNotificationData();
    }, []);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Sửa thông tin thông báo ${id}`,
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);
    const handleImageSelected = (hasSelectedImage: boolean, imageUri: string | null) => {
        setHasImage(hasSelectedImage);
        const isChanged = imageUri?.startsWith("file:") ?? false;
        setImageChanged(isChanged);
    };
    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    };

    const onChange = ({ type }: { type: string }, selectedDate?: Date) => {
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
    if (getNotificationLoading){
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Đang tải thông tin thông báo...</Text>
            </View>
        )
    }

    const handleSubmit = async () => {
        try {
            let uploadedImageUrl = originalData.imageUrl ;

            if (imageChanged) {
                console.log("Should");
                const result = await imagePickerRef.current?.upload();
                if (result) {
                    console.log('Upload thành công:', result.secure_url);
                    uploadedImageUrl = result.secure_url;
                } else {
                    console.warn('Không thể upload hình ảnh');
                    return;
                }
            }
            const notificationData: INotification = {
                id: id as string,
                title: title.trim(),
                description: description.trim(),
                date: publishDate,
                imageUrl: uploadedImageUrl,
            };
            await updateNotificationApi(async () => {
                await apiService.put(`/notifications`, notificationData);
            });

            setOriginalData(notificationData);
            console.log('Cập nhật thành công');
            router.back();

            router.replace({
                pathname: "/(dashboard)/notification",
                params: {
                    updatedCategory: JSON.stringify(notificationData),
                },
            });
        } catch (err) {
            console.error('Lỗi upload hoặc update:', err);
        }
    };

    const isSubmitDisabled = (): boolean => {

        const invalidInput = !title.trim() ;

        return invalidInput;
    };

    async function deleteOnPress() {
        try {
            await deleteNotificationApi(async () => {
                await apiService.delete(`/notifications/${id}`);
            });
            router.back();
            router.replace({
                pathname: "/(dashboard)/notification",
                params: {
                    deletedCategory: id
                },
            });
        }
        catch (error) {
            console.error("Error deleting notification:", error);
        }

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
                    <View className="px-7">
                        <View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên thông báo*</Text>
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
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Ngày thông báo*</Text>
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
                                    initialUri={imageUri}
                                />
                            </View>
                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 20 }}
                                onPress={deleteOnPress}
                            >
                                <Icon name="trash-can-outline" size={20} color="red" />
                                <Text style={{ color: "red", marginLeft: 5, fontWeight: "bold" }}>
                                    Xóa thông báo này
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