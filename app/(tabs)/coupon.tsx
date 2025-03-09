import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {SafeAreaView, StyleSheet, StatusBar, View, Text, TouchableOpacity, Image} from "react-native";
import {Colors} from "@/constants/Colors";
import {Ticket} from "lucide-react-native";
import React from "react";

export default function CouponScreen() {
    const imgUri = "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2FT%E1%BA%A7ng%201%20D%E1%BB%B1%20%C3%A1n%20Chung%20c%C6%B0%20cao%20c%E1%BA%A5p%20Homyland%20Riverside%2C%20%C4%90.%20Nguy%E1%BB%85n%20Duy%20Trinh%2C%20P.%20B%C3%ACnh%20Tr%C6%B0ng%20T%C3%A2y%2C%20Qu%E1%BA%ADn%202%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=94f584d3-53b7-44ac-bc1e-b4c6e9f5ad9d";
    const safeHeight = StatusBar.currentHeight || 0;
    return (
        <SafeAreaView style={{flex: 1, marginTop: safeHeight}}>
            <View className={"px-4 bg-amber-500"}>
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
                <Text className={"flex-1 text-xl font-bold"}>Khuyến mãi</Text>
                <TouchableOpacity>
                    <View className={`flex-row h-12 items-center bg-white rounded-full px-4 py-2 `}>
                        <Text className={'font-bold ml-2 text-[#E47905] text-lg'}>Xem tất cả</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View className={"flex-row py-2 items-center bg-gray-100 px-4 "}>
                <Text className={"flex-1 text-xl font-bold"}>Khuyến mãi</Text>
                <TouchableOpacity>
                    <View className={`flex-row h-12 items-center bg-white rounded-full px-4 py-2 `}>
                        <Text className={'font-bold ml-2 text-[#E47905] text-lg'}>Xem tất cả</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View className={"flex-1 bg-gray-100 px-4 gap-3"}>
                <TouchableOpacity >
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
                <TouchableOpacity >
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

        </SafeAreaView>

    );
}

