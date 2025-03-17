import {
    View, Image, Text, TouchableOpacity, TextInput,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDropDown from '@/components/OtherScreen/CustomDropDown';

export default function AddVoucher() {
    const navigation = useNavigation();
    const [voucherName, setVoucherName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [minODC, setMinODC] = useState("");
    const [minODP, setMinODP] = useState("");
    const [valueDB, setValueDB] = useState("");
    const [valueI, setValueI] = useState("");
    const [image, setImage] = useState<string | null>(null);

    const typeList = [
        { label: "Trà", value: "tea" },
        { label: "Cafe", value: "cafe" },
        { label: "Nước trái cây", value: "fruit" },
    ];
    const freeShipping = [
        { label: "0", value: "false" },
        { label: "1", value: "true" },
    ];

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
                                <CustomDropDown items={typeList} placeholder="0 / 1" />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Ngày hết hạn*</Text>
                                <TextInput
                                    placeholder="Nhập ngày hết hạn"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={dueDate}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setDueDate}
                                />
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
                        </View>
                        <TouchableOpacity className='bg-gray-200 py-4 px-5 rounded-[10px] items-center mt-[15px]'>
                            <Text className='text-white text-[16px] font-bold'>Xong</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}