import { View, Text, TextInput, TouchableOpacity, StatusBar, Platform } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { Search, Map } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { MapScreen } from "@/components/ShopScreen/MapScreen";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderActions from '../common/HeaderActions';

export default function ShopHeader({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const insets = useSafeAreaInsets();

    return (
        <View
            className={"border-b border-gray-100"}
            style={{
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top
            }}
        >
            <View className={"px-5 py-3"}>
                <ThemedView className={"flex flex-row items-center"}>
                    <ThemedText className={"font-bold text-xl"}>Cửa hàng</ThemedText>
                    <HeaderActions userId={userId} />
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
            </View>
        </View>
    )
}