import {
    View, Text, TextInput, ScrollView, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity,
    StyleSheet,
    Button,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {useNavigation, useRouter} from 'expo-router';
import ImagePickerPreview, { ImagePickerPreviewRef } from '@/components/common/ImagePickerPreview';
import { useApi } from '@/hooks/useApi';
import apiService from '@/constants/config/axiosConfig';
import MapModal from '@/components/common/MapModal';

export default function AddShop() {
    const navigation = useNavigation();
    const [shopName, setShopName] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [address, setAddress] = useState('');
    const [hasImage, setHasImage] = useState(false);
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const router = useRouter();
    const {
        loading: shopLoading,
        errorMessage: shopErrorMessage,
        callApi: callShopApi,
    } = useApi<void>();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Thêm cửa hàng mới',
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
        return (
            !shopName.trim() ||
            !address.trim() ||
            !longitude.trim() ||
            !latitude.trim() ||
            !hasImage
        );
    };

    const handleImageSelected = (hasSelectedImage: boolean) => {
        setHasImage(hasSelectedImage);
    };

    const handleSubmit = async () => {
        try {
            const result = await imagePickerRef.current?.upload();
            if (result) {
                const shopData = {
                    name: shopName.trim(),
                    address: address.trim(),
                    longitude: Number(longitude),
                    latitude: Number(latitude),
                    imageURL: result.secure_url,
                };

                await callShopApi(async () => {
                    const response = await apiService.post('/stores', shopData);
                    console.log('Thêm cửa hàng thành công:', response.data);
                });

                setShopName('');
                setAddress('');
                setLongitude('');
                setLatitude('');
                setHasImage(false);
                imagePickerRef.current?.reset();
                router.back()
            }
        } catch (err) {
            console.error('Lỗi upload:', err);
        }
    };

    const handleAddressPress = () => {
        setModalVisible(true);
    };
    const handleConfirm = ({ address, lat, lon }: { address: string; lat: number; lon: number }) => {
        setAddress(address);
        setLatitude(lat.toString());
        setLongitude(lon.toString());
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-white"
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                    <View className="py-0 px-7">
                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên cửa hàng*</Text>
                        <TextInput
                            placeholder="Nhập tên cửa hàng"
                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                            value={shopName}
                            placeholderTextColor="#9ca3af"
                            onChangeText={setShopName}
                        />

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Địa chỉ*</Text>
                        <TouchableOpacity onPress={handleAddressPress} activeOpacity={0.8}>
                            <View
                                style={{
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: '#d1d5db',
                                    borderRadius: 10,
                                    backgroundColor: '#fff',
                                    marginTop: 10,
                                    minHeight: 48,
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: address ? '#111827' : '#9ca3af',
                                    }}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {address || 'Nhập địa chỉ'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Kinh độ*</Text>
                        <TextInput
                            placeholder="Nhập kinh độ"
                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-gray-200 mt-[10px]"
                            value={longitude}
                            placeholderTextColor="#9ca3af"
                            editable={false}
                            keyboardType="numeric"
                        />

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Vĩ độ*</Text>
                        <TextInput
                            placeholder="Nhập vĩ độ"
                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-gray-200 mt-[10px]"
                            value={latitude}
                            placeholderTextColor="#9ca3af"
                            editable={false}
                            keyboardType="numeric"
                        />

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

                        <MapModal
                            visible={modalVisible}
                            initialAddress={address}
                            initialLat={latitude ? parseFloat(latitude) : null}
                            initialLon={longitude ? parseFloat(longitude) : null}
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};