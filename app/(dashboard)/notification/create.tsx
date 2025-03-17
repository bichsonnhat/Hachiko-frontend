import {
    View, Image, Text, TouchableOpacity, TextInput, Pressable,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddNotification() {

    const navigation = useNavigation();
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [pulishDate, setPublishDate] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [image, setImage] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Thêm thông báo mới",
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
                setPublishDate(formatDate(selectedDate));
            }
        } else {
            toggleDatePicker();
        }
    };

    const confirmIOSDate = () => {
        setPublishDate(formatDate(date));
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
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                >
                    <View className="px-7">
                        <View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên thông báo*</Text>
                                <TextInput
                                    placeholder="Nhập tên thông báo"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={categoryName}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setCategoryName}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Mô tả*</Text>
                                <TextInput
                                    placeholder="Nhập mô tả"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={description}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setDescription}
                                />
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
                                            value={pulishDate}
                                            onPressIn={toggleDatePicker}
                                        />
                                    </Pressable>
                                )}
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Hình ảnh*</Text>
                                <TouchableOpacity className="mt-3" onPress={onImagePick}>
                                    {!image ? (
                                        <Image
                                            source={require('./../../../assets/images/Profile/camera.png')}
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
                            <TouchableOpacity className='bg-gray-200 py-4 px-5 rounded-[10px] items-center mt-[15px]'>
                                <Text className='text-white text-[16px] font-bold'>Xong</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}