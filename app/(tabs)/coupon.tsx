import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {SafeAreaView, StyleSheet, StatusBar, View, Text, TouchableOpacity, Image} from "react-native";
import {Colors} from "@/constants/Colors";
import {Ticket} from "lucide-react-native";
import React, {useState} from "react";
import VoucherDetailModal from "@/components/VoucherScreen/VoucherDetailModal";
import { useRouter} from "expo-router";

export default function CouponScreen() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const imgUri = "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Voucher%2FGi%E1%BA%A3m%2030%25%20%2B%20Freeship%20%C4%90%C6%A1n%20T%E1%BB%AB%203%20Ly.jpg?alt=media&token=72f401b9-4334-48eb-aea8-cdf05a815c77";
    const safeHeight = StatusBar.currentHeight || 0;
    return (
        <SafeAreaView style={{flex: 1, marginTop: safeHeight}}>
            <View className={"px-4 bg-[#ff9123]"}>
                <View className={"flex-row py-2 items-center"}>
                    <Text className={"flex-1 text-xl font-bold text-white"}>Ưu đãi</Text>
                    <TouchableOpacity>
                        <ThemedView
                            className={`flex-row h-12 items-center bg-white rounded-full px-4 py-2 shadow-md shadow-slate-600 `}>
                            <Ticket size={24} color={Colors.PRIMARY}/>
                            <Text className={'font-bold ml-2 text-[#E47905] text-lg'}>Voucher của tôi</Text>
                        </ThemedView>
                    </TouchableOpacity>

                </View>

            </View>
            <View className={"bg-gray-100 px-4 flex-row py-2 items-center"}>
                <Text className={"flex-1 text-xl font-bold"}>Sắp hết hạn</Text>
                <TouchableOpacity onPress={() => router.push('/voucher/my-voucher')}>
                    <View className={`flex-row h-12 items-center bg-[#fff7e3] rounded-full px-4 py-2 `}>
                        <Text className={'font-bold ml-2 text-[#ffa145] text-lg'}>Xem tất cả</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View className={"flex-row py-2 items-center bg-gray-100 px-4 "}>
                <Text className={"flex-1 text-xl font-bold"}>Voucher của bạn</Text>
                <TouchableOpacity onPress={() => router.push('/voucher/my-voucher')}>
                    <View className={`flex-row h-12 items-center bg-[#fff7e3] rounded-full px-4 py-2 `}>
                        <Text className={'font-bold ml-2 text-[#ffa145] text-lg'}>Xem tất cả</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View className={"flex-1 bg-gray-100 px-4 gap-3"}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <View className="flex-row items-center bg-white rounded-xl px-4 shadow-md">
                        {/* Hình ảnh bên trái */}
                        <Image source={{uri: imgUri}} className="w-[85px] h-[85px] rounded-lg mr-4"/>
                        <Image className={"mr-4"} source={require("@/assets/images/Voucher/voucher-slider.png")}/>
                        <View className={"flex-1"} >
                            <Text className="text-sm font-bold text-black">
                                Giảm 30% Bánh Khi Mua Nước Size Lớn Nhất
                            </Text>
                            <Text className="text-xs text-[#E47905] mt-1">
                                Hết hạn 29/04/2024
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <ThemedView className="flex-row items-center bg-white rounded-xl px-4 shadow-md">
                        {/* Hình ảnh bên trái */}
                        <Image source={{uri: imgUri}} className="w-[85px] h-[85px] rounded-lg mr-4"/>
                        <Image className={"mr-4"} source={require("@/assets/images/Voucher/voucher-slider.png")}/>
                        <View className={"flex-1"} >
                            <Text className="text-sm font-bold text-black">
                                Giảm 30% Bánh Khi Mua Nước Size Lớn Nhất
                            </Text>
                            <Text className="text-xs text-[#E47905] mt-1">
                                Hết hạn 29/04/2024
                            </Text>
                        </View>
                    </ThemedView>
                </TouchableOpacity>

            </View>
            <VoucherDetailModal visible={modalVisible} onClose={() => {
                setModalVisible(false)
                console.log("Close")
            }} />

        </SafeAreaView>

    );
}

