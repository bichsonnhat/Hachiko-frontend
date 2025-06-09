import {
    View, Image, Text, TouchableOpacity, TextInput,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {useNavigation, useRouter} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDropDown from '@/components/OtherScreen/CustomDropDown';
import ImagePickerPreview, { ImagePickerPreviewRef } from '@/components/common/ImagePickerPreview';
import { useApi } from '@/hooks/useApi';
import { ICategory } from '@/constants';
import apiService from '@/constants/config/axiosConfig';
import { IDropdownItem } from '@/constants/interface/dropdown-item.interface';

export default function AddProduct() {
    const navigation = useNavigation();
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [hasImage, setHasImage] = useState(false);
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categoryList, setCategoryList] = useState<IDropdownItem[]>([]);
    const router = useRouter();
    const {
        loading: categoryLoading,
        errorMessage: categoryErrorMessage,
        callApi: callCategoryApi,
    } = useApi<void>();

    const {
        loading: productLoading,
        errorMessage: productErrorMessage,
        callApi: callProductApi,
    } = useApi<void>();

    const fetchCategoryData = async () => {
        await callCategoryApi(async () => {
            const { data } = await apiService.get("/categories");

            const mapped = data.map((item: ICategory) => ({
                label: item.name,
                value: item.id,
            }));
            setCategoryList(mapped);
        });
    };
    useEffect(() => {
        fetchCategoryData();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Thêm sản phẩm mới",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);

    const handleImageSelected = (hasSelectedImage: boolean) => {
        setHasImage(hasSelectedImage);
    };

    const isSubmitDisabled = (): boolean => {
        return !productName.trim() || !price.trim() || !selectedCategory || !hasImage;
    };

    const handleSubmit = async () => {
        try {
            const result = await imagePickerRef.current?.upload();
            if (result) {
                const productData = {
                    title: productName,
                    price: Number(price),
                    description,
                    categoryID: selectedCategory,
                    imageUrl: result.secure_url,
                };

                await callProductApi(async () => {
                    const response = await apiService.post('/products', productData);
                    console.log('Thêm sản phẩm thành công:', response.data);
                });

                setProductName('');
                setPrice('');
                setDescription('');
                setSelectedCategory(null);
                setHasImage(false);
                imagePickerRef.current?.reset();
                router.back();
            }
        } catch (err) {
            console.error('Lỗi khi thêm sản phẩm:', err);
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
                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên sản phẩm*</Text>
                        <TextInput
                            placeholder="Nhập tên sản phẩm"
                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                            value={productName}
                            placeholderTextColor="#9ca3af"
                            onChangeText={setProductName}
                        />

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Giá sản phẩm*</Text>
                        <TextInput
                            placeholder="Nhập giá sản phẩm"
                            keyboardType="numeric"
                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                            value={price}
                            placeholderTextColor="#9ca3af"
                            onChangeText={setPrice}
                        />

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Mô tả</Text>
                        <TextInput
                            placeholder="Nhập mô tả"
                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                            value={description}
                            placeholderTextColor="#9ca3af"
                            onChangeText={setDescription}
                        />

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Danh mục*</Text>
                        <View style={{ zIndex: 10 }}>
                            <CustomDropDown
                                items={categoryList}
                                placeholder="Chọn danh mục"
                                onSelect={(value) => setSelectedCategory(value)}
                            />
                        </View>

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Hình ảnh*</Text>
                        <ImagePickerPreview
                            ref={imagePickerRef}
                            onImageSelected={handleImageSelected}
                        />

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isSubmitDisabled()}
                            className={`py-4 px-5 rounded-[10px] items-center mt-[20px] ${isSubmitDisabled() ? 'bg-gray-200' : 'bg-[#f59e0b]'}`}
                        >
                            <Text className={`text-[16px] font-bold ${isSubmitDisabled() ? 'text-gray-500' : 'text-white'}`}>
                                Xong
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}