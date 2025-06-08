import {
    View, Image, Text, TouchableOpacity, TextInput, Pressable, Switch,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {useNavigation, useRouter} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import CustomDropDown from '@/components/OtherScreen/CustomDropDown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from "react-hook-form";
import { IVoucher } from "@/constants";
import ImagePickerPreview, { ImagePickerPreviewRef } from "@/components/common/ImagePickerPreview";
import apiService from "@/constants/config/axiosConfig";
import {useApi} from "@/hooks/useApi";

interface ICreateVoucher extends Omit<IVoucher, "id"> {}

export enum VoucherType {
    DELIVERY = "Delivery",
    PICKUP = "Pickup",
}

export default function AddVoucher() {
    const navigation = useNavigation();
    const [showPicker, setShowPicker] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const imagePickerRef = useRef<ImagePickerPreviewRef>(null);
    const [imageError, setImageError] = useState("");
    const router = useRouter();

    const handleImageSelected = (hasSelectedImage: boolean) => {
        setHasImage(hasSelectedImage);
        if (hasSelectedImage) {
            setImageError("");
        }
    };

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        trigger,
        setError,
        clearErrors,
    } = useForm<ICreateVoucher>({
        defaultValues: {
            title: "",
            description: "",
            imgUrl: "",
            discountPrice: 0,
            discountPercent: 0,
            isFreeShip: false,
            minOrderPrice: 0,
            minOrderItem: 0,
            type: VoucherType.DELIVERY,
            expiryDate: new Date(),
        },
        mode: "onChange",
    });

    const watchedType = watch("type");
    const watchedDiscountPrice = watch("discountPrice");
    const watchedDiscountPercent = watch("discountPercent");
    const watchedMinOrderPrice = watch("minOrderPrice");
    const watchedExpiryDate = watch("expiryDate");

    const typeList = [
        { label: "Giao hàng", value: VoucherType.DELIVERY },
        { label: "Tới lấy", value: VoucherType.PICKUP },
    ];

    const {
        loading: voucherLoading,
        errorMessage: voucherErrorMessage,
        callApi: callVoucherApi,
    } = useApi<void>();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Thêm Voucher mới",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);

    // Validate discount logic
    useEffect(() => {
        if (watchedDiscountPrice > 0 && watchedDiscountPercent > 0) {
            setError("discountPrice", {
                type: "manual",
                message: "Chỉ được chọn một trong hai: giá giảm hoặc phần trăm giảm"
            });
            setError("discountPercent", {
                type: "manual",
                message: "Chỉ được chọn một trong hai: giá giảm hoặc phần trăm giảm"
            });
        } else {
            clearErrors(["discountPrice", "discountPercent"]);
        }
    }, [watchedDiscountPrice, watchedDiscountPercent, setError, clearErrors]);

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (selectedDate) {
            setValue("expiryDate", selectedDate);
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

        // Validate discount logic
        if (watchedDiscountPrice > 0 && watchedDiscountPercent > 0) {
            Alert.alert("Lỗi", "Chỉ được chọn một trong hai: giá giảm hoặc phần trăm giảm");
            return false;
        }

        // Validate at least one discount method
        if (watchedDiscountPrice <= 0 && watchedDiscountPercent <= 0) {
            Alert.alert("Lỗi", "Phải có ít nhất một loại giảm giá (giá giảm hoặc phần trăm giảm)");
            return false;
        }

        // Validate discount percent range
        if (watchedDiscountPercent > 100) {
            Alert.alert("Lỗi", "Phần trăm giảm không được vượt quá 100%");
            return false;
        }

        // Validate discount price vs min order price
        if (watchedDiscountPrice > 0 && watchedDiscountPrice >= watchedMinOrderPrice) {
            Alert.alert("Lỗi", "Giá giảm phải nhỏ hơn giá đơn hàng tối thiểu");
            return false;
        }

        // Validate expiry date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiryDate = new Date(watchedExpiryDate);
        expiryDate.setHours(0, 0, 0, 0);

        if (expiryDate <= today) {
            Alert.alert("Lỗi", "Ngày hết hạn phải sau ngày hôm nay");
            return false;
        }

        return isFormValid;
    };

    const onSubmit = async (data: ICreateVoucher) => {
        try {
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

            const finalData: ICreateVoucher = {
                ...data,
                imgUrl: result.secure_url,
            };

            console.log("Form Data:", finalData);

            await callVoucherApi(async () => {
                const response = await apiService.post('/vouchers', finalData);
                console.log(response.data);
                Alert.alert("Thành công", "Voucher đã được tạo thành công!", [
                    { text: "OK", onPress: () => router.back() }
                ]);
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo voucher. Vui lòng thử lại.");
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN');
    };

    // Helper function to format currency
    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 bg-white"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                >
                    <View className="flex-1 px-7">
                        {/* Tên voucher */}
                        <View>
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên voucher*</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: "Tên voucher là bắt buộc",
                                    minLength: { value: 3, message: "Tên voucher phải có ít nhất 3 ký tự" },
                                    maxLength: { value: 100, message: "Tên voucher không được vượt quá 100 ký tự" }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Nhập tên voucher"
                                        className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        placeholderTextColor="#9ca3af"
                                    />
                                )}
                                name="title"
                            />
                            {errors.title && <Text className="text-red-500 text-sm mt-1">{errors.title.message}</Text>}
                        </View>

                        {/* Loại voucher */}
                        <View style={{ zIndex: 1000 }}>
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Loại voucher*</Text>
                            <Controller
                                control={control}
                                rules={{ required: "Loại voucher là bắt buộc" }}
                                render={({ field: { onChange, value } }) => (
                                    <CustomDropDown
                                        items={typeList}
                                        placeholder="Chọn loại voucher"
                                        onSelect={(selectedValue) => onChange(selectedValue)}
                                        value={value}
                                    />
                                )}
                                name="type"
                            />
                            {errors.type && <Text className="text-red-500 text-sm mt-1">{errors.type.message}</Text>}
                        </View>

                        {/* Mô tả */}
                        <View>
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Mô tả</Text>
                            <Controller
                                control={control}
                                rules={{
                                    maxLength: { value: 500, message: "Mô tả không được vượt quá 500 ký tự" }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Nhập mô tả voucher"
                                        className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        placeholderTextColor="#9ca3af"
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                    />
                                )}
                                name="description"
                            />
                            {errors.description && <Text className="text-red-500 text-sm mt-1">{errors.description.message}</Text>}
                        </View>

                        {/* Discount Section */}
                        <View className="bg-gray-50 p-4 rounded-[10px] mt-[15px]">
                            <Text className="text-[16px] text-gray-700 font-semibold mb-3">Thông tin giảm giá*</Text>
                            <Text className="text-[14px] text-gray-500 mb-3">Chọn một trong hai loại giảm giá:</Text>

                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[10px]">Giá giảm (VND)</Text>
                                <Controller
                                    control={control}
                                    rules={{
                                        validate: (value) => {
                                            if (value < 0) return "Giá giảm không được âm";
                                            if (value > 0 && watchedDiscountPercent > 0) {
                                                return "Chỉ được chọn một trong hai loại giảm giá";
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Nhập giá giảm (VND)"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value > 0 ? formatCurrency(value.toString()) : ''}
                                            onBlur={onBlur}
                                            onChangeText={(text) => {
                                                const numericValue = text.replace(/[^0-9]/g, '');
                                                onChange(Number(numericValue) || 0);
                                            }}
                                            placeholderTextColor="#9ca3af"
                                            keyboardType="numeric"
                                        />
                                    )}
                                    name="discountPrice"
                                />
                                {errors.discountPrice && <Text className="text-red-500 text-sm mt-1">{errors.discountPrice.message}</Text>}
                            </View>

                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Phần trăm giảm (%)</Text>
                                <Controller
                                    control={control}
                                    rules={{
                                        validate: (value) => {
                                            if (value < 0) return "Phần trăm giảm không được âm";
                                            if (value > 100) return "Phần trăm giảm không được vượt quá 100%";
                                            if (value > 0 && watchedDiscountPrice > 0) {
                                                return "Chỉ được chọn một trong hai loại giảm giá";
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Nhập phần trăm giảm (0-100)"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value > 0 ? value.toString() : ''}
                                            onBlur={onBlur}
                                            onChangeText={(text) => {
                                                const numericValue = Number(text) || 0;
                                                if (numericValue <= 100) {
                                                    onChange(numericValue);
                                                }
                                            }}
                                            placeholderTextColor="#9ca3af"
                                            keyboardType="numeric"
                                        />
                                    )}
                                    name="discountPercent"
                                />
                                {errors.discountPercent && <Text className="text-red-500 text-sm mt-1">{errors.discountPercent.message}</Text>}
                            </View>
                        </View>

                        {/* Free Ship Switch */}
                        <View className="flex-row items-center justify-between mt-[15px] bg-gray-50 p-4 rounded-[10px]">
                            <View className="flex-1">
                                <Text className="text-[16px] text-gray-500 font-semibold">Miễn phí vận chuyển</Text>
                                <Text className="text-[14px] text-gray-400 mt-1">Áp dụng miễn phí ship cho đơn hàng</Text>
                            </View>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Switch
                                        value={value}
                                        onValueChange={onChange}
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
                                    />
                                )}
                                name="isFreeShip"
                            />
                        </View>

                        {/* Min Order Price */}
                        <View>
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Giá đơn hàng tối thiểu*</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: "Giá đơn hàng tối thiểu là bắt buộc",
                                    validate: (value) => {
                                        if (value <= 0) return "Giá đơn hàng tối thiểu phải lớn hơn 0";
                                        if (watchedDiscountPrice > 0 && value <= watchedDiscountPrice) {
                                            return "Giá đơn hàng tối thiểu phải lớn hơn giá giảm";
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Nhập giá đơn hàng tối thiểu"
                                        className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                        value={value > 0 ? formatCurrency(value.toString()) : ''}
                                        onBlur={onBlur}
                                        onChangeText={(text) => {
                                            const numericValue = text.replace(/[^0-9]/g, '');
                                            onChange(Number(numericValue) || 0);
                                        }}
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="numeric"
                                    />
                                )}
                                name="minOrderPrice"
                            />
                            {errors.minOrderPrice && <Text className="text-red-500 text-sm mt-1">{errors.minOrderPrice.message}</Text>}
                        </View>

                        {/* Min Order Item */}
                        <View>
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Số lượng sản phẩm tối thiểu*</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: "Số lượng sản phẩm tối thiểu là bắt buộc",
                                    validate: (value) => {
                                        if (value <= 0) return "Số lượng sản phẩm tối thiểu phải lớn hơn 0";
                                        return true;
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        placeholder="Nhập số lượng sản phẩm tối thiểu"
                                        className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                        value={value > 0 ? value.toString() : ''}
                                        onBlur={onBlur}
                                        onChangeText={(text) => onChange(Number(text) || 0)}
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="numeric"
                                    />
                                )}
                                name="minOrderItem"
                            />
                            {errors.minOrderItem && <Text className="text-red-500 text-sm mt-1">{errors.minOrderItem.message}</Text>}
                        </View>

                        {/* Ngày hết hạn */}
                        <View>
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Ngày hết hạn*</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: "Ngày hết hạn là bắt buộc",
                                    validate: (value) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const expiryDate = new Date(value);
                                        expiryDate.setHours(0, 0, 0, 0);

                                        if (expiryDate <= today) {
                                            return "Ngày hết hạn phải sau ngày hôm nay";
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field: { value } }) => (
                                    <TouchableOpacity
                                        onPress={toggleDatePicker}
                                        className="p-[10px] border border-gray-300 rounded-[10px] bg-white mt-[10px]"
                                    >
                                        <Text className={`text-[16px] ${value ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {value ? formatDate(value) : "Chọn ngày hết hạn"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                name="expiryDate"
                            />
                            {errors.expiryDate && <Text className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</Text>}

                            {showPicker && (
                                <DateTimePicker
                                    value={watch("expiryDate") || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                    minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Tomorrow
                                />
                            )}
                        </View>

                        {/* Hình ảnh */}
                        <View>
                            <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">
                                Hình ảnh voucher*
                            </Text>
                            <Text className="text-[14px] text-gray-400 mt-1">
                                Chọn hình ảnh đại diện cho voucher
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

                        {/* Error Message */}
                        {voucherErrorMessage && (
                            <View className="bg-red-50 border border-red-200 rounded-[10px] p-3 mt-[15px]">
                                <Text className="text-red-600 text-[14px]">{voucherErrorMessage}</Text>
                            </View>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={voucherLoading}
                            className={`${voucherLoading ? 'bg-gray-400' : 'bg-blue-500'} py-4 px-5 rounded-[10px] items-center mt-[15px]`}>
                            <Text className='text-white text-[16px] font-bold'>
                                {voucherLoading ? 'Đang tạo...' : 'Tạo Voucher'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}