import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { Ticket, Bell, Search, Map } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import BadgeButton from "@/components/HomeScreen/BadgeButton";
import NotificationButton from "@/components/HomeScreen/NotificationButton";

export default function ShopHeader() {
    return (
        <ThemedView className={"p-5 pt-10"}>
            <ThemedView className={"flex flex-row items-center"}>
                <ThemedText className={"font-bold text-xs"}>Cửa hàng</ThemedText>
                <View className={"ml-auto flex flex-row"}>
                    <BadgeButton className='mr-2' icon={<Ticket size={24} color={Colors.PRIMARY} />} text={11} />
                    <NotificationButton icon={<Bell size={24} color="black" />} count={1} />
                </View>
            </ThemedView>
            <ThemedView className={`flex-row items-center justify-between py-2`}>
                <View className={`flex-row items-center bg-gray-200 rounded-lg px-3 py-2 flex-1`}>
                    <Search size={20} color={Colors.light.icon}></Search>
                    <TextInput
                        placeholder="Tìm kiếm"
                        placeholderTextColor="gray"
                        className={`ml-2 text-gray-500 flex-1`}
                    />
                </View>
                <TouchableOpacity className={`ml-3 flex-row items-center`}>
                    <Map size={20} color={Colors.light.icon}></Map>
                    <Text className={`ml-1 font-semibold`}>Bản đồ</Text>
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    )
}