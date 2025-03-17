import {
    View, Image, Text, TouchableOpacity, TextInput, Pressable,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDropDown from '@/components/OtherScreen/CustomDropDown';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function UpdateVoucher() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [voucherName, setVoucherName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [minODC, setMinODC] = useState("");
    const [minODP, setMinODP] = useState("");
    const [valueDB, setValueDB] = useState("");
    const [valueI, setValueI] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    const typeList = [
        { label: "Tại chỗ", value: "sit" },
        { label: "Mang đi", value: "takeaway" },
    ];
    const freeShipping = [
        { label: "0", value: "false" },
        { label: "1", value: "true" },
    ];
    const listUser = [
        { label: "Nhat", value: "1" },
        { label: "Hieu", value: "2" }
    ]
    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Sửa thông tin Voucher ${id}`,
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

    const onChange = ({ type }: { type: string }, selectedDate?: Date) => {
        if (type === "set" && selectedDate) {
            setDate(selectedDate);
            if (Platform.OS === "android") {
                toggleDatePicker();
                setDueDate(formatDate(selectedDate));
            }
        } else {
            toggleDatePicker();
        }
    };

    const confirmIOSDate = () => {
        setDueDate(formatDate(date));
        toggleDatePicker();
    };

    const formatDate = (rawDate: Date) => {
        let date = new Date(rawDate);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        let day = date.getDate().toString().padStart(2, "0");
        return `${day}-${month}-${year}`;
    };

    const onImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
            console.log(result);
        }
        console.log(result);
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
                        <View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên voucher*</Text>
                                <TextInput
                                    placeholder="Nhập tên voucher"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={voucherName}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setVoucherName}
                                />
                            </View>
                            <View style={{ zIndex: 1000 }}>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]" >Loại voucher*</Text>
                                <CustomDropDown items={typeList} placeholder="Chọn loại voucher" />
                            </View>
                            <View style={{ zIndex: 500 }}>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]" >FreeShipping*</Text>
                                <CustomDropDown items={freeShipping} placeholder="0 / 1" />
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
                                            value={dueDate}
                                            onPressIn={toggleDatePicker}
                                        />
                                    </Pressable>
                                )}
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Mô tả</Text>
                                <TextInput
                                    placeholder="Nhập mô tả"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={description}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setDescription}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Min Order Capacity*</Text>
                                <TextInput
                                    placeholder="Nhập Min Order Capacity"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={minODC}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setMinODC}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Min Order Price*</Text>
                                <TextInput
                                    placeholder="Nhập Min Order Price"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={minODP}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setMinODP}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Value Double*</Text>
                                <TextInput
                                    placeholder="Nhập Value Double"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={valueDB}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setValueDB}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Value Integer*</Text>
                                <TextInput
                                    placeholder="Nhập Value Integer"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={valueI}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setValueI}
                                />
                            </View>
                            <View style={{ zIndex: 500 }}>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]" >Áp dụng</Text>
                                <CustomDropDown items={listUser} placeholder="Chọn người dùng" />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Hình ảnh*</Text>
                                <TouchableOpacity className="mt-3" onPress={onImagePick}>
                                    {!image ? (
                                        <Image
                                            source={require('./../../../../assets/images/Profile/camera.png')}
                                            className="w-[150px] h-[150px]"
                                        />
                                    ) : (
                                        <Image
                                            source={{ uri: image }}
                                            className="w-[150px] h-[150px] rounded-2xl"
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={{ flexDirection: "row", marginTop: 20 }}>
                            <Icon name="trash-can-outline" size={20} color="red" />
                            <Text style={{ color: "red", marginLeft: 5, fontWeight: "bold" }}>
                                Xóa voucher này
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='bg-gray-200 py-4 px-5 rounded-[10px] items-center mt-[15px]'>
                            <Text className='text-white text-[16px] font-bold'>Xong</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}