import {
    View, Image, Text, TouchableOpacity, TextInput,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useLocalSearchParams, router } from 'expo-router';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useApi } from '@/hooks/useApi';
import apiService from '@/constants/config/axiosConfig';
import ImagePickerPreview, { ImagePickerPreviewRef } from '@/components/common/ImagePickerPreview';

export default function UpdateShop() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();

    const [shopName, setShopName] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [address, setAddress] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [hasImage, setHasImage] = useState(false);
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);

    const [originalData, setOriginalData] = useState({
        name: '',
        address: '',
        imageURL: '',
        longitude: '',
        latitude: '',
    });

    const {
        loading: getStoreLoading,
        errorMessage: getStoreErrorMessage,
        callApi: getStoreApi,
    } = useApi<void>();

    const {
        loading: updateStoreLoading,
        errorMessage: updateStoreErrorMessage,
        callApi: updateStoreApi,
    } = useApi<void>();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Sửa thông tin cửa hàng`,
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);

    const fetchStoreData = async () => {
        await getStoreApi(async () => {
            const { data } = await apiService.get(`/stores/${id}`);
            setShopName(data.name);
            setAddress(data.address);
            setImageUri(data.imageURL);
            setLongitude(data.longitude.toString());
            setLatitude(data.latitude.toString());
            setHasImage(!!data.imageURL);

            setOriginalData({
                name: data.name,
                address: data.address,
                imageURL: data.imageURL,
                longitude: data.longitude.toString(),
                latitude: data.latitude.toString(),
            });
        });
    };

    useEffect(() => {
        fetchStoreData();
    }, []);

    const isSubmitDisabled = (): boolean => {
        const nameUnchanged = shopName.trim() === originalData.name;
        const addressUnchanged = address.trim() === originalData.address;
        const longitudeUnchanged = longitude === originalData.longitude;
        const latitudeUnchanged = latitude === originalData.latitude;
        const imageUnchanged = imageUri === originalData.imageURL;

        const noChange = nameUnchanged && addressUnchanged && longitudeUnchanged && latitudeUnchanged && imageUnchanged;
        const invalidInput = !shopName.trim() || !address.trim() || !longitude.trim() || !latitude.trim() || !hasImage;

        return invalidInput || noChange;
    };

    const handleImageSelected = (hasSelectedImage: boolean) => {
        setHasImage(hasSelectedImage);
    };

    const handleSubmit = async () => {
        // Kiểm tra thay đổi
        const nameUnchanged = shopName.trim() === originalData.name;
        const addressUnchanged = address.trim() === originalData.address;
        const longitudeUnchanged = longitude === originalData.longitude;
        const latitudeUnchanged = latitude === originalData.latitude;
        const imageUnchanged = imageUri === originalData.imageURL;

        const noChange = nameUnchanged && addressUnchanged && longitudeUnchanged && latitudeUnchanged && imageUnchanged;
        if (noChange) {
            console.log("Không có thay đổi nào để cập nhật.");
            return;
        }

        try {
            let uploadedImageUrl = originalData.imageURL;

            // Nếu ảnh thay đổi thì upload lên Cloudinary
            if (!imageUnchanged && imagePickerRef.current) {
                const result = await imagePickerRef.current.upload();
                if (result) {
                    uploadedImageUrl = result.secure_url;
                } else {
                    console.warn('Không thể upload hình ảnh');
                    return;
                }
            }

            const shopData = {
                id: id,
                name: shopName.trim(),
                address: address.trim(),
                longitude: Number(longitude),
                latitude: Number(latitude),
                imageURL: uploadedImageUrl,
            };

            await updateStoreApi(async () => {
                await apiService.put(`/stores`, shopData);
            });

            setOriginalData({
                name: shopName.trim(),
                address: address.trim(),
                longitude,
                latitude,
                imageURL: uploadedImageUrl,
            });

            imagePickerRef.current?.reset();
            console.log('Cập nhật thành công');
            router.back();
            router.replace({
                pathname: "/(dashboard)/store",
                params: {
                    updatedStore: JSON.stringify(shopData),
                },
            });
        } catch (err) {
            console.error('Lỗi upload hoặc update:', err);
        }
    };

    if (getStoreLoading) {
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
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên cửa hàng*</Text>
                            <TextInput
                                placeholder="Nhập tên cửa hàng"
                                className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                value={shopName}
                                placeholderTextColor="#9ca3af"
                                onChangeText={setShopName}
                            />
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Kinh độ*</Text>
                            <TextInput
                                placeholder="Nhập kinh độ"
                                className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                value={longitude}
                                placeholderTextColor="#9ca3af"
                                onChangeText={setLongitude}
                                keyboardType="numeric"
                            />
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Vĩ độ*</Text>
                            <TextInput
                                placeholder="Nhập vĩ độ"
                                className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                value={latitude}
                                placeholderTextColor="#9ca3af"
                                onChangeText={setLatitude}
                                keyboardType="numeric"
                            />
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Địa chỉ*</Text>
                            <TextInput
                                placeholder="Nhập địa chỉ"
                                className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                value={address}
                                placeholderTextColor="#9ca3af"
                                onChangeText={setAddress}
                            />
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Hình ảnh*</Text>
                            <ImagePickerPreview
                                ref={imagePickerRef}
                                onImageSelected={handleImageSelected}
                                initialUri={imageUri}
                            />
                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 20 }}>
                                <Icon name="trash-can-outline" size={20} color="red" />
                                <Text style={{ color: "red", marginLeft: 5, fontWeight: "bold" }}>
                                    Xóa cửa hàng này
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
    );
}