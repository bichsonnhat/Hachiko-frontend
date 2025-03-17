import {
    View, Text, Image, TouchableOpacity, TextInput, Pressable,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDropdown from '@/components/OtherScreen/CustomDropDown';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function UpdateUser() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [image, setImage] = useState<string | null>(null);
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const genderList = [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
        { label: "Khác", value: "other" },
    ];

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    };

    const onChange = ({ type }: { type: string }, selectedDate?: Date) => {
        if (type === "set" && selectedDate) {
            setDate(selectedDate);
            if (Platform.OS === "android") {
                toggleDatePicker();
                setDateOfBirth(formatDate(selectedDate));
            }
        } else {
            toggleDatePicker();
        }
    };

    const confirmIOSDate = () => {
        setDateOfBirth(formatDate(date));
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

    const onPress = () => {

    }

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
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                >
                    <View className="py-5 px-7">
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

                        <View className="mt-[10px]">
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold">Họ</Text>
                                <TextInput
                                    placeholder="Phan"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên</Text>
                                <TextInput
                                    placeholder="Châu Hoàng"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Email</Text>
                                <TextInput
                                    placeholder="example@email.com"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Ngày sinh</Text>
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
                                            value={dateOfBirth}
                                            onPressIn={toggleDatePicker}
                                        />
                                    </Pressable>
                                )}
                            </View>
                            <View style={{ zIndex: 1000 }}>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Giới tính</Text>
                                <CustomDropdown items={genderList} placeholder="Chọn giới tính" />
                            </View>
                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 20 }}>
                                <Icon name="trash-can-outline" size={20} color="red" />
                                <Text style={{ color: "red", marginLeft: 5, fontWeight: "bold" }}>
                                    Xóa nguời dùng này
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className='bg-gray-200 py-4 px-5 rounded-[10px] items-center mt-[15px]'>
                                <Text className='text-white text-[16px] font-bold'>Cập nhật tài khoản</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}
