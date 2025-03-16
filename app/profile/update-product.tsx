import {
    View, Image, Text, TouchableOpacity, TextInput,
    Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomDropDown from '@/components/OtherScreen/CustomDropDown';

export default function UpdateProduct() {
    const navigation = useNavigation();
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState<string | null>(null);

    const categoryList = [
        { label: "Trà", value: "tea" },
        { label: "Cafe", value: "cafe" },
        { label: "Nước trái cây", value: "fruit" },
    ];

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Sửa thông tin sản phẩm",
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
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                >
                    <View className="py-0 px-7">
                        <View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Tên sản phẩm*</Text>
                                <TextInput
                                    placeholder="Nhập tên sản phẩm"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={productName}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setProductName}
                                />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Giá sản phẩm*</Text>
                                <TextInput
                                    placeholder="Nhập giá sản phẩm"
                                    className="p-[10px] border border-gray-300 rounded-[10px] text-[16px] bg-white mt-[10px]"
                                    value={price}
                                    placeholderTextColor="#9ca3af"
                                    onChangeText={setPrice}
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
                            <View style={{ zIndex: 1000 }}>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]" >Danh mục*</Text>
                                <CustomDropDown items={categoryList} placeholder="Chọn danh mục" />
                            </View>
                            <View>
                                <Text className="text-[16px] text-gray-500 font-semibold mt-[15px]">Hình ảnh*</Text>
                                <TouchableOpacity className="mt-3" onPress={onImagePick}>
                                    {!image ? (
                                        <Image
                                            source={require('./../../assets/images/Profile/camera.png')}
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
                                Xóa sản phẩm này
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