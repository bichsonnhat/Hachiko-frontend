import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from 'expo-router';

export default function SavedAddress() {
    const navigation = useNavigation()
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Gửi góp ý về ứng dụng",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        })
    }, [navigation])

    const addresses = [
        {
            id: "1",
            type: "Nhà",
            icon: "home-outline",
            address: "ktx",
            contact: "Admin 0905123456",
        },
        {
            id: "2",
            type: "Công ty",
            icon: "office-building-outline",
            address: "khu phố 6, Linh Trung, Thủ Đức",
            contact: "Linh Bảo 0336678051",
        },
        {
            id: "3",
            type: "Gym",
            icon: "bookmark-outline",
            address: "Le Van Viet, 9 District",
            contact: "Admin 0905123456",
        },
    ];
    return (
        <View className="flex-1 bg-[#fff] ">
            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/profile/add-address")}>
                        <Icon className="px-5 " name="plus" size={28} color="#000" />
                        <View className="w-full border-b border-[#ddd] py-8">
                            <Text className="text-[16px] font-bold ">Thêm địa chỉ mới</Text>
                        </View>
                    </TouchableOpacity>
                }
                renderItem={({ item }) => (
                    <View className="flex-row items-center">
                        <Icon name={item.icon} size={28} color="#000" className="px-5" />
                        <View className="border-b border-[#ddd] flex-row py-4 flex-1 items-center justify-between">
                            <View>
                                <Text className="text-[16px] font-bold">{item.type}</Text>
                                <Text className="text-[14px] text-[#555]">{item.address}</Text>
                                <Text className="text-[14px] text-[#777]">{item.contact}</Text>
                            </View>
                            <TouchableOpacity className="mr-5">
                                <Icon name="pencil-outline" size={28} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>


                )}
            />
        </View>
    );
};
