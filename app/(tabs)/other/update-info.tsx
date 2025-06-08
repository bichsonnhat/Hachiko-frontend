import {
    View,
    Text,
    TextInput,
    Pressable,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomDropdown from "@/components/OtherScreen/CustomDropDown";
import { useAuth } from "@clerk/clerk-expo";
import { IUser } from "@/constants/interface/user.interface";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import { Colors } from "@/constants/Colors";

// Define form data interface
interface FormData {
    lastName: string;
    firstName: string;
    email: string;
    birthDate: string;
    phoneNumber: string;
    gender: string | null;
}

export default function UpdateInfo() {
    const navigation = useNavigation();
    const { userId } = useAuth();
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [user, setUser] = useState<IUser>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalSuccess, setModalSuccess] = useState(true);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm<FormData>({
        defaultValues: {
            lastName: "",
            firstName: "",
            email: "",
            birthDate: "",
            phoneNumber: "",
            gender: null,
        },
        mode: "onChange",
    });

    const {
        loading: userLoading,
        errorMessage: userError,
        callApi: callUserApi,
    } = useApi<void>();

    const genderList = [
        { label: "Nam", value: "Male" },
        { label: "Nữ", value: "Female" },
        { label: "Khác", value: "Other" },
    ];

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    };

    const onChangeDate = (
        { type }: { type: string },
        selectedDate?: Date,
        onChange?: (value: string) => void
    ) => {
        if (type === "set" && selectedDate) {
            setDate(selectedDate);
            const formattedDate = formatDate(selectedDate);
            if (Platform.OS === "android") {
                toggleDatePicker();
                onChange?.(formattedDate);
            }
        } else {
            toggleDatePicker();
        }
    };

    const confirmIOSDate = (onChange: (value: string) => void) => {
        const formattedDate = formatDate(date);
        onChange(formattedDate);
        toggleDatePicker();
    };

    const formatDate = (rawDate: Date) => {
        let date = new Date(rawDate);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        let day = date.getDate().toString().padStart(2, "0");
        return `${day}-${month}-${year}`;
    };

    const parseISODate = (isoDate: string): Date => {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) {
            console.error("Invalid ISO date:", isoDate);
            return new Date();
        }
        return date;
    };

    const formatISOToDDMMYYYY = (isoDate: string): string => {
        const date = parseISODate(isoDate);
        return formatDate(date);
    };

    const formatDDMMYYYYToISO = (ddmmyyyy: string): string => {
        const [day, month, year] = ddmmyyyy.split("-");
        const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
        return date.toISOString();
    };

    const onSubmit = async (data: FormData) => {
        try {
            const transformedData = {
                ...data,
                birthDate: formatDDMMYYYYToISO(data.birthDate),
            };
            await apiService.put(`/users/${userId}`, transformedData);
            setModalMessage("Cập nhật thông tin thành công!");
            setModalSuccess(true);
            setModalVisible(true);
        } catch (error: any) {
            setModalMessage(
                error.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại."
            );
            setModalSuccess(false);
            setModalVisible(true);
            console.error("Update failed:", error);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Cập nhật thông tin",
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: "#000000",
                backgroundColor: "white",
            },
        });
    }, [navigation]);

    const fetchUserData = async () => {
        await callUserApi(async () => {
            const response = await apiService.get<IUser>(`/users/${userId}`);
            const userData = response.data;
            setUser(userData);
            setValue("lastName", userData.lastName || "");
            setValue("firstName", userData.firstName || "");
            setValue("email", userData.email || "");
            setValue("phoneNumber", userData.phoneNumber || "");
            if (userData.birthDate) {
                const formattedDate = formatISOToDDMMYYYY(userData.birthDate);
                setValue("birthDate", formattedDate);
                const dateObj = parseISODate(userData.birthDate);
                setDate(dateObj);
            }
            setValue("gender", userData.gender ?? null);
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

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
                    <View className="py-5 px-7">
                        <View className="mt-[10px]">
                            {/* Last Name */}
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold">Họ</Text>
                                <Controller
                                    control={control}
                                    name="lastName"
                                    rules={{ required: "Họ là bắt buộc" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Nhập họ"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                                {errors.lastName && (
                                    <Text className="text-red-500 text-[14px] mt-1">
                                        {errors.lastName.message}
                                    </Text>
                                )}
                            </View>

                            {/* First Name */}
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">
                                    Tên
                                </Text>
                                <Controller
                                    control={control}
                                    name="firstName"
                                    rules={{ required: "Tên là bắt buộc" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Nhập tên"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                                {errors.firstName && (
                                    <Text className="text-red-500 text-[14px] mt-1">
                                        {errors.firstName.message}
                                    </Text>
                                )}
                            </View>

                            {/* Email */}
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">
                                    Email
                                </Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: "Email là bắt buộc",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Email không hợp lệ",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Nhập email"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] text-[#a1a1aa] bg-[#f3f4f6] mt-[10px]"
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            keyboardType="email-address"
                                            editable={false}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <Text className="text-red-500 text-[14px] mt-1">
                                        {errors.email.message}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">
                                    Số điện thoại
                                </Text>
                                <Controller
                                    control={control}
                                    name="phoneNumber"
                                    rules={{
                                        required: "Số điện thoại là bắt buộc",
                                        pattern: {
                                            value: /^[0-9]{9,11}$/,
                                            message: "Số điện thoại không hợp lệ",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="Nhập số điện thoại"
                                            className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            keyboardType="phone-pad"
                                            maxLength={11}
                                        />
                                    )}
                                />
                                {errors.phoneNumber && (
                                    <Text className="text-red-500 text-[14px] mt-1">
                                        {errors.phoneNumber.message}
                                    </Text>
                                )}
                            </View>

                            {/* Date of Birth */}
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">
                                    Ngày sinh
                                </Text>
                                <Controller
                                    control={control}
                                    name="birthDate"
                                    rules={{ required: "Ngày sinh là bắt buộc" }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            {showPicker && (
                                                <DateTimePicker
                                                    mode="date"
                                                    display="spinner"
                                                    value={date}
                                                    onChange={(event, selectedDate) =>
                                                        onChangeDate(event, selectedDate, onChange)
                                                    }
                                                    className="h-[120px] mt-[-10px]"
                                                />
                                            )}
                                            {showPicker && Platform.OS === "ios" && (
                                                <View className="flex-row justify-around">
                                                    <TouchableOpacity
                                                        className="bg-[#11182711] h-[50px] justify-center items-center rounded-[50px] mt-[10px] mb-[15px] px-[20px]"
                                                        onPress={toggleDatePicker}
                                                    >
                                                        <Text className="text-[#E47905] text-[14px] font-medium">
                                                            Cancel
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        className="h-[50px] justify-center items-center rounded-[50px] mt-[10px] mb-[15px] px-[20px] bg-[#E47905]"
                                                        onPress={() => confirmIOSDate(onChange)}
                                                    >
                                                        <Text className="text-[#fff] text-[14px] font-medium">
                                                            Confirm
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            {!showPicker && (
                                                <Pressable onPress={toggleDatePicker}>
                                                    <TextInput
                                                        placeholder="Nhập ngày sinh"
                                                        className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                                        value={value}
                                                        editable={false}
                                                    />
                                                </Pressable>
                                            )}
                                        </>
                                    )}
                                />
                                {errors.birthDate && (
                                    <Text className="text-red-500 text-[14px] mt-1">
                                        {errors.birthDate.message}
                                    </Text>
                                )}
                            </View>

                            {/* Gender */}
                            <View style={{ zIndex: 1000 }}>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">
                                    Giới tính
                                </Text>
                                <Controller
                                    control={control}
                                    name="gender"
                                    rules={{ required: "Giới tính là bắt buộc" }}
                                    render={({ field: { onChange, value } }) => (
                                        <CustomDropdown
                                            items={genderList}
                                            placeholder="Chọn giới tính"
                                            value={value}
                                            onSelect={(itemValue) => onChange(itemValue)}
                                            zIndex={2000}
                                        />
                                    )}
                                />
                                {errors.gender && (
                                    <Text className="text-red-500 text-[14px] mt-1">
                                        {errors.gender.message}
                                    </Text>
                                )}
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: isValid ? Colors.PRIMARY : "#e5e7eb",
                                    padding: 16,
                                    borderRadius: 10,
                                    alignItems: "center",
                                    marginTop: 20,
                                }}
                                onPress={handleSubmit(onSubmit)}
                                disabled={userLoading || !isValid}
                            >
                                <Text style={{ color: isValid ? "#fff" : "#a1a1aa", fontWeight: "bold" }}>
                                    Cập nhật tài khoản
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Result Dialog */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 10,
                                    padding: 20,
                                    width: "80%",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        color: modalSuccess ? Colors.PRIMARY : "#dc2626",
                                        marginBottom: 10,
                                    }}
                                >
                                    {modalSuccess ? "Thành công" : "Lỗi"}
                                </Text>
                                <Text style={{ fontSize: 16, color: "#374151", textAlign: "center" }}>
                                    {modalMessage}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: Colors.PRIMARY,
                                        paddingVertical: 12,
                                        paddingHorizontal: 20,
                                        borderRadius: 10,
                                        marginTop: 20,
                                    }}
                                    onPress={() => {
                                        setModalVisible(false);
                                        if (modalSuccess) {
                                            navigation.goBack();
                                        }
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                                        OK
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}