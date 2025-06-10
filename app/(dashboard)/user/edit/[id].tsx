import {
    View, Text, Image, TouchableOpacity, TextInput, Pressable,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useLocalSearchParams, useRouter} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDropdown from '@/components/OtherScreen/CustomDropDown';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useForm, Controller} from "react-hook-form";
import {Gender, IUser} from "@/constants/interface/user.interface";
import {useApi} from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";

export default function UpdateUser() {
    const {id} = useLocalSearchParams();
    const navigation = useNavigation();
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const router = useRouter();
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: {errors},
        trigger,
        reset
    } = useForm<IUser>({
        defaultValues: {
            id: id as string,
            firstName: "",
            lastName: "",
            email: "",
            birthDate: "",
            gender: Gender.MALE,
            phoneNumber: "",
            isAdmin: false,
        },
        mode: "onChange",
    });

    // Watch values for reactive updates
    const birthDate = watch('birthDate');


    const genderList = [
        {label: "Nam", value: Gender.MALE},
        {label: "Nữ", value: Gender.FEMALE},
        {label: "Khác", value: Gender.OTHER},
    ];

    const {
        loading: getUserLoading,
        errorMessage: getUserErrorMessage,
        callApi: getUserApi,
    } = useApi<void>();
    const {
        loading: deleteUserLoading,
        errorMessage: deleteUserErrorMessage,
        callApi: deleteUserApi,
    } = useApi<void>();

    const {
        loading: updateUserLoading,
        errorMessage: updateUserErrorMessage,
        callApi: updateUserApi,
    } = useApi<void>();

    const fetchUserData = async () => {
        await getUserApi(async () => {
            const {data} = await apiService.get<IUser>(`/users/${id}`);
            console.log("Fetched user data:", data);
            reset({
                ...data,
                birthDate: formatDate(new Date(data.birthDate)), // convert ISO to dd-MM-yyyy
            });
        })
    }

    useEffect(() => {
        fetchUserData();
        // Set initial tempDate when component mounts
        if (birthDate) {
            const parsedDate = parseDateString(birthDate);
            setTempDate(parsedDate);
        }
    }, []);

    // Helper function to parse date string
    const parseDateString = (dateString: string): Date => {
        if (!dateString) return new Date();

        // Nếu là định dạng ISO
        if (dateString.includes("T")) {
            return new Date(dateString);
        }

        // Nếu là định dạng dd-MM-yyyy
        const parts = dateString.split("-");
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }

        return new Date();
    };

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setTempDate(selectedDate);
            if (Platform.OS === 'android') {
                setShowPicker(false);
                setValue('birthDate', formatDate(selectedDate));
            }
        } else if (Platform.OS === 'android') {
            setShowPicker(false);
        }
    };

    const confirmIOSDate = () => {
        setValue('birthDate', formatDate(tempDate));
        setShowPicker(false);
    };

    const cancelIOSDate = () => {
        setShowPicker(false);
    };

    const formatDate = (rawDate: Date) => {
        let date = new Date(rawDate);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        let day = date.getDate().toString().padStart(2, "0");
        return `${day}-${month}-${year}`;
    };
    const formatDateToISO = (dateStr: string) => {
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    };
    const onSubmit = async (data: IUser) => {
        const formattedData = {
            ...data,
            birthDate: formatDateToISO(data.birthDate), // "2025-06-04"
        };

        await updateUserApi(async () => {
            const response = await apiService.put(`/users/${id}`, formattedData);
            router.back();
            router.replace({
                pathname: "/(dashboard)/user",
                params: {
                    updatedUser: JSON.stringify(response.data),
                },
            });
        });
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
            await deleteUserApi(async () => {
                await apiService.delete(`/users/${id}`);
            });
            router.back();
            router.replace({
                pathname: "/(dashboard)/user",
                params: {
                    deletedUser: id
                },
            });
        } catch (error) {
            console.error("Error deleting Advertisement:", error);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Cập nhật thông tin người dùng ${id}`,
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);

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
                    <View className="py-5 px-7">
                        <View className="mt-[10px]">
                            {/* Họ */}
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold">Họ</Text>
                                <Controller
                                    control={control}
                                    name="firstName"
                                    rules={{required: "Họ là bắt buộc"}}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <TextInput
                                            placeholder="Phan"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                />
                                {errors.lastName && (
                                    <Text className="text-red-500 text-sm mt-1">{errors.lastName.message}</Text>
                                )}
                            </View>

                            {/* Tên */}
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên</Text>
                                <Controller
                                    control={control}
                                    name="lastName"
                                    rules={{required: "Tên là bắt buộc"}}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <TextInput
                                            placeholder="Châu Hoàng"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    )}
                                />
                                {errors.firstName && (
                                    <Text className="text-red-500 text-sm mt-1">{errors.firstName.message}</Text>
                                )}
                            </View>
                            {/* PhoneNumber */}
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Email</Text>
                                <Controller
                                    control={control}
                                    name="phoneNumber"
                                    rules={{
                                        required: "Số điện thoại là bắt buộc",
                                        pattern: {
                                            value: /^\d{10,11}$/,
                                            message: "Số điện thoại không hợp lệ"
                                        }
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <TextInput
                                            placeholder="0123456789"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="phone-pad"
                                        />
                                    )}
                                />
                            </View>

                            {/* Email */}
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Email</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: "Email là bắt buộc",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Email không hợp lệ"
                                        }
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <TextInput
                                            placeholder="example@email.com"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="email-address"
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
                                )}
                            </View>

                            {/* Ngày sinh */}
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Ngày sinh</Text>

                                {/* iOS Date Picker */}
                                {showPicker && Platform.OS === 'ios' && (
                                    <View>
                                        <DateTimePicker
                                            mode="date"
                                            display="spinner"
                                            value={tempDate}
                                            onChange={onDateChange}
                                            className="h-[120px] mt-[-10px]"
                                        />
                                        <View className="flex-row justify-around">
                                            <TouchableOpacity
                                                className="bg-[#11182711] h-[50px] justify-center items-center rounded-[50px] mt-[10px] mb-[15px] px-[20px]"
                                                onPress={cancelIOSDate}
                                            >
                                                <Text className="text-[#E47905] text-[14px] font-medium">Cancel</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                className="bg-[#E47905] h-[50px] justify-center items-center rounded-[50px] mt-[10px] mb-[15px] px-[20px]"
                                                onPress={confirmIOSDate}
                                            >
                                                <Text className="text-[#fff] text-[14px] font-medium">Confirm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {/* Android Date Picker */}
                                {showPicker && Platform.OS === 'android' && (
                                    <DateTimePicker
                                        mode="date"
                                        display="default"
                                        value={tempDate}
                                        onChange={onDateChange}
                                    />
                                )}

                                {/* Date Input Field */}
                                <Controller
                                    control={control}
                                    name="birthDate"
                                    rules={{required: "Ngày sinh là bắt buộc"}}
                                    render={({field: {value}}) => (
                                        <Pressable onPress={toggleDatePicker}>
                                            <TextInput
                                                placeholder="08-06-2004"
                                                className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                                editable={false}
                                                value={value}
                                                pointerEvents="none"
                                            />
                                        </Pressable>
                                    )}
                                />
                                {errors.birthDate && (
                                    <Text className="text-red-500 text-sm mt-1">{errors.birthDate.message}</Text>
                                )}
                            </View>

                            {/* Giới tính */}
                            <View style={{zIndex: 1000}}>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Giới tính</Text>
                                <Controller
                                    control={control}
                                    name="gender"
                                    rules={{required: "Giới tính là bắt buộc"}}
                                    render={({field: {onChange, value}}) => (
                                        <CustomDropdown
                                            items={genderList}
                                            placeholder="Chọn giới tính"
                                            value={value}
                                            onSelect={onChange}
                                        />
                                    )}
                                />
                                {errors.gender && (
                                    <Text className="text-red-500 text-sm mt-1">{errors.gender.message}</Text>
                                )}
                            </View>

                            {/* Delete Button */}
                           {/* <TouchableOpacity
                                style={{flexDirection: "row", marginTop: 20}}
                                onPress={handleDeletePress}
                            >
                                <Icon name="trash-can-outline" size={20} color="red"/>
                                <Text style={{color: "red", marginLeft: 5, fontWeight: "bold"}}>
                                    Xóa nguời dùng này
                                </Text>
                            </TouchableOpacity>*/}
                            {/* Submit Button */}
                            <TouchableOpacity
                                className='bg-blue-500 py-4 px-5 rounded-[10px] items-center mt-[15px]'
                                onPress={handleSubmit(onSubmit)}
                                disabled={updateUserLoading}
                            >
                                <Text className='text-white text-[16px] font-bold'>
                                    {updateUserLoading ? 'Đang cập nhật...' : 'Cập nhật tài khoản'}
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
                                Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.
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
                                    disabled={deleteUserLoading}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        paddingHorizontal: 20,
                                        borderRadius: 10,
                                        backgroundColor: deleteUserLoading ? '#fca5a5' : '#ef4444',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: 'white'
                                    }}>
                                        {deleteUserLoading ? 'Đang xóa...' : 'Xác nhận'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}