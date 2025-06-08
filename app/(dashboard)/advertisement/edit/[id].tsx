import {
    View, Image, Text, TouchableOpacity, TextInput, Pressable,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useLocalSearchParams, useRouter} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from '@react-native-community/datetimepicker';
import {useApi} from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import ImagePickerPreview, {ImagePickerPreviewRef} from "@/components/common/ImagePickerPreview";
import {IAdvertisement} from '@/constants/interface/advertisement.interface';
import {Controller, useForm} from "react-hook-form";

export default function UpdateAdvertisement() {
    const router = useRouter();
    const {id} = useLocalSearchParams();
    const navigation = useNavigation();
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const [hasImage, setHasImage] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: {errors},
    } = useForm<IAdvertisement>({
        defaultValues: {
            id: id as string,
            description: "",
            imageUrl: ""
        },
        mode: "onChange",
    });
    const {
        loading: getAdvertisementLoading,
        errorMessage: getAdvertisementErrorMessage,
        callApi: getAdvertisementApi,
    } = useApi<void>();

    const {
        loading: updateAdvertisementLoading,
        errorMessage: updateAdvertisementErrorMessage,
        callApi: updateAdvertisementApi,
    } = useApi<void>();
    const {
        loading: deleteAdvertisementLoading,
        errorMessage: deleteAdvertisementErrorMessage,
        callApi: deleteAdvertisementApi,
    } = useApi<void>();
    const fetchAdvertisementData = async () => {
        try {
            await getAdvertisementApi(async () => {
                const {data} = await apiService.get<IAdvertisement>(`/advertisements/${id}`);
                reset({
                    id: data.id,
                    description: data.description,
                    imageUrl: data.imageUrl
                });
                setImageUri(data.imageUrl);
                setHasImage(!!data.imageUrl);
            });
        }
        catch (err) {
            console.log(err)
        }

    };
    useEffect(() => {
        fetchAdvertisementData();
    }, []);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Sửa thông tin quảng cáo ${id}`,
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

        const isChanged = imageUri?.startsWith("file:") ?? false;
        setImageChanged(isChanged);
    };
    if (getAdvertisementLoading ) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Đang tải thông tin quảng cáo...</Text>
            </View>
        );
    }

    const onSubmit = async (data: IAdvertisement) => {
        try {
            let uploadedImageUrl = getValues().imageUrl;
            if (imageChanged) {
                 const result = await imagePickerRef.current?.upload();
                 if (result) {
                     console.log('Upload thành công:', result.secure_url);
                     uploadedImageUrl = result.secure_url;
                 } else {
                     console.warn('Không thể upload hình ảnh');
                     return;
                 }
             }
            const finalData = {
                ...data,
                imageUrl: uploadedImageUrl,
            };
            console.log('Final data to update:', finalData);
            await updateAdvertisementApi(async () => {
                const response = await apiService.put(`/advertisements`, finalData);
                console.log('Cập nhật quảng cáo thành công:', response.data);
                router.back();
                router.replace({
                    pathname: "/(dashboard)/advertisement",
                    params: {
                        updatedAdvertisement: JSON.stringify(response.data),
                    },
                });
            });

        } catch (err) {
            console.error('Lỗi upload hoặc update:', err);
        }
    };

    const isSubmitDisabled = (): boolean => {
        return false;
    };

    const handleDeletePress = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteModal(false);
        try {
            await deleteAdvertisementApi(async () => {
                await apiService.delete(`/advertisements/${id}`);
            });
            router.back();
            router.replace({
                pathname: "/(dashboard)/advertisement",
                params: {
                    deletedCategory: id
                },
            });
        } catch (error) {
            console.error("Error deleting Advertisement:", error);
        }
    };

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
                                <Controller
                                    control={control}
                                    name="description"
                                    rules={{required: "Tên thông báo là bắt buộc"}}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={4}
                                            placeholder="Nhập tên thông báo"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            placeholderTextColor="#9ca3af"
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
                                    initialUri={imageUri}
                                />
                            </View>
                            <TouchableOpacity
                                style={{flexDirection: "row", marginTop: 20}}
                                onPress={handleDeletePress}
                            >
                                <Icon name="trash-can-outline" size={20} color="red"/>
                                <Text style={{color: "red", marginLeft: 5, fontWeight: "bold"}}>
                                    Xóa quảng cáo này
                                </Text>
                            </TouchableOpacity>
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
                {/* Delete Confirmation Modal */}
                <Modal
                    visible={showDeleteModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleDeleteCancel}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 20
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 15,
                            padding: 20,
                            width: '100%',
                            maxWidth: 350,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}>
                            <View style={{alignItems: 'center', marginBottom: 20}}>
                                <Icon name="alert-circle-outline" size={50} color="#ef4444" />
                            </View>

                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginBottom: 10,
                                color: '#1f2937'
                            }}>
                                Xác nhận xóa
                            </Text>

                            <Text style={{
                                fontSize: 16,
                                textAlign: 'center',
                                marginBottom: 25,
                                color: '#6b7280',
                                lineHeight: 22
                            }}>
                                Bạn có chắc chắn muốn xóa quảng cáo này không? Hành động này không thể hoàn tác.
                            </Text>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: 15
                            }}>
                                <TouchableOpacity
                                    onPress={handleDeleteCancel}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        paddingHorizontal: 20,
                                        borderRadius: 10,
                                        borderWidth: 1,
                                        borderColor: '#d1d5db',
                                        backgroundColor: 'white',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: '#6b7280'
                                    }}>
                                        Hủy
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleDeleteConfirm}
                                    disabled={deleteAdvertisementLoading}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        paddingHorizontal: 20,
                                        borderRadius: 10,
                                        backgroundColor: deleteAdvertisementLoading ? '#fca5a5' : '#ef4444',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: 'white'
                                    }}>
                                        {deleteAdvertisementLoading ? 'Đang xóa...' : 'Xác nhận'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}