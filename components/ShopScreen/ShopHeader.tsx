import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { Ticket, Bell, Search, Map } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import BadgeButton from "@/components/HomeScreen/BadgeButton";
import NotificationButton from "@/components/HomeScreen/NotificationButton";
import { router, useNavigation } from "expo-router";
import { MapScreen } from "@/components/ShopScreen/MapScreen";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderActions from '../common/HeaderActions';

export default function ShopHeader() {
    const [isOpen, setIsOpen] = useState(false)
    const insets = useSafeAreaInsets();

    return (
        <ThemedView style={{ paddingTop: insets.top }} className={"px-4 py-3 border-b border-gray-100"}>
            <ThemedView className={"flex flex-row items-center"}>
                <ThemedText className={"font-bold text-xl"}>Cửa hàng</ThemedText>
                <HeaderActions />
            </ThemedView>
            <ThemedView className={`flex-row mt-2 items-center justify-between py-2`}>
                <View className={`flex-row items-center bg-gray-200 rounded-lg px-3 py-2 flex-1`}>
                    <Search size={20} color={Colors.light.icon}></Search>
                    <TextInput
                        placeholder="Tìm kiếm"
                        placeholderTextColor="gray"
                        className={`ml-2 text-gray-500 flex-1`}
                    />
                </View>
                <TouchableOpacity
                    className={`ml-3 flex-row items-center`}
                    onPress={() => {
                        setIsOpen(true)

                    }}
                >
                    <Map size={20} color={Colors.light.icon}></Map>
                    <Text className={`ml-1 font-semibold`}>Bản đồ</Text>
                </TouchableOpacity>
            </ThemedView>
            <MapScreen visible={isOpen} onClose={() => {
                setIsOpen(false)
            }} />
        </ThemedView>
    )
}