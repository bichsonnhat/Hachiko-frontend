import {
    View, Text, TextInput, ScrollView, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ActivityIndicator
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useLocalSearchParams, router } from 'expo-router';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDropDown from '@/components/OtherScreen/CustomDropDown';
import ImagePickerPreview, { ImagePickerPreviewRef } from '@/components/common/ImagePickerPreview';
import { useApi } from '@/hooks/useApi';
import apiService from '@/constants/config/axiosConfig';
import { ICategory } from '@/constants/interface/category.interface';
import { IDropdownItem } from '@/constants/interface/dropdown-item.interface';

export default function EditProduct() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();

    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categoryList, setCategoryList] = useState<IDropdownItem[]>([]);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [hasImage, setHasImage] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);

    const [originalData, setOriginalData] = useState({
        title: '',
        price: '',
        description: '',
        categoryID: '',
        imageUrl: '',
    });

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

    const fetchProductData = async () => {
        await callProductApi(async () => {
            const { data } = await apiService.get(`/products/${id}`);
            setProductName(data.title);
            setPrice(data.price.toString());
            setDescription(data.description || '');
            setSelectedCategory(data.categoryID);
            setImageUri(data.imageUrl);
            setHasImage(!!data.imageUrl);

            setOriginalData({
                title: data.title,
                price: data.price.toString(),
                description: data.description || '',
                categoryID: data.categoryID,
                imageUrl: data.imageUrl,
            });
        });
    };

    useEffect(() => {
        fetchCategoryData();
        fetchProductData();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Sửa sản phẩm",
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

    const isSubmitDisabled = (): boolean => {
        const nameUnchanged = productName.trim() === originalData.title;
        const priceUnchanged = price.trim() === originalData.price;
        const descUnchanged = (description || '') === (originalData.description || '');
        const categoryUnchanged = selectedCategory === originalData.categoryID;

        const noChange = nameUnchanged && priceUnchanged && descUnchanged && categoryUnchanged && !imageChanged;
        const invalidInput = !productName.trim() || !price.trim() || !selectedCategory || !hasImage;

        return invalidInput || noChange;
    };

    const handleSubmit = async () => {
        const nameUnchanged = productName.trim() === originalData.title;
        const priceUnchanged = price.trim() === originalData.price;
        const descUnchanged = (description || '') === (originalData.description || '');
        const categoryUnchanged = selectedCategory === originalData.categoryID;

        const noChange = nameUnchanged && priceUnchanged && descUnchanged && categoryUnchanged && !imageChanged;
        if (noChange) {
            console.log("Không có thay đổi nào để cập nhật.");
            return;
        }

        try {
            let uploadedImageUrl = originalData.imageUrl;

            const shouldUploadImage = imageChanged;
            if (shouldUploadImage && imagePickerRef.current) {
                const result = await imagePickerRef.current.upload();
                if (result) {
                    uploadedImageUrl = result.secure_url;
                } else {
                    console.warn('Không thể upload hình ảnh');
                    return;
                }
            }

            const productData = {
                id,
                title: productName.trim(),
                price: Number(price),
                description,
                categoryID: selectedCategory,
                imageUrl: uploadedImageUrl,
            };

            await callProductApi(async () => {
                await apiService.put('/products', productData);
            });

            setOriginalData({
                title: productName.trim(),
                price: price.trim(),
                description,
                categoryID: selectedCategory!,
                imageUrl: uploadedImageUrl,
            });

            imagePickerRef.current?.reset();
            console.log('Cập nhật thành công');
            router.back();
            setTimeout(() => {
                router.replace({
                    pathname: "/(dashboard)/product",
                    params: {
                        updatedProduct: JSON.stringify(productData),
                    },
                });
            }, 300);
        } catch (err) {
            console.error('Lỗi upload hoặc update:', err);
        }
    };

    if (productLoading || categoryLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#f59e0b" />
            </View>
        );
    }

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
                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px] h-[100px]"
                            value={description}
                            placeholderTextColor="#9ca3af"
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Danh mục*</Text>
                        <View style={{ zIndex: 10 }}>
                            <CustomDropDown
                                items={categoryList}
                                placeholder="Chọn danh mục"
                                onSelect={(value) => setSelectedCategory(value)}
                                value={selectedCategory}
                            />
                        </View>

                        <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Hình ảnh*</Text>
                        <ImagePickerPreview
                            ref={imagePickerRef}
                            onImageSelected={handleImageSelected}
                            initialUri={imageUri}
                        />

                      {/*  <TouchableOpacity style={{ flexDirection: "row", marginTop: 20 }}>
                            <Icon name="trash-can-outline" size={20} color="red" />
                            <Text style={{ color: "red", marginLeft: 5, fontWeight: "bold" }}>
                                Xóa sản phẩm này
                            </Text>
                        </TouchableOpacity>*/}
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
    );
}