import React, {useEffect, useState} from "react";
import {View, Text, FlatList, Dimensions, TouchableOpacity, Image} from "react-native";
import {TabView, SceneMap, TabBar, NavigationState} from "react-native-tab-view";
import {useNavigation} from "expo-router";
import {ThemedView} from "@/components/ThemedView";
import VoucherDetailModal from "@/components/VoucherScreen/VoucherDetailModal";

const imgUri = "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Voucher%2FGi%E1%BA%A3m%2030%25%20%2B%20Freeship%20%C4%90%C6%A1n%20T%E1%BB%AB%203%20Ly.jpg?alt=media&token=72f401b9-4334-48eb-aea8-cdf05a815c77";


const vouchers = [
    {
        id: "1",
        title: "Miễn Phí Giao Hàng",
        expireDate: "30-06-2024",
    },
];
const AvailableVouchers = () => (
    <View className="flex-1 bg-gray-100 p-4">
        <View className="flex-row items-center">
            <Text className="text-xl font-bold mr-4">Sắp hết hạn</Text>
            <View className="bg-orange-500 rounded-full px-3 py-1 flex items-center justify-center">
                <Text className="text-white font-bold text-md">0</Text>
            </View>
        </View>
        <View className="flex-row items-center mt-4">
            <Text className="text-xl font-bold mr-4">Sẵn sàng sử dụng</Text>
            <View className="bg-orange-500 rounded-full px-3 py-1 flex items-center justify-center">
                <Text className="text-white font-bold text-md">2</Text>
            </View>
        </View>

        <View className={"flex-1 gap-3 mt-4"}>
            <TouchableOpacity>
                <View className="flex-row items-center bg-white rounded-xl px-4 shadow-md">
                    {/* Hình ảnh bên trái */}
                    <Image source={{uri: imgUri}} className="w-[85px] h-[85px] rounded-lg mr-4"/>
                    <Image className={"mr-4"} source={require("@/assets/images/Voucher/voucher-slider.png")}/>
                    <View className={"flex-1"}>
                        <Text className="text-sm font-bold text-black">
                            Giảm 30% Bánh Khi Mua Nước Size Lớn Nhất
                        </Text>
                        <Text className="text-xs text-[#E47905] mt-1">
                            Hết hạn 29/04/2024
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <ThemedView className="flex-row items-center bg-white rounded-xl px-4 shadow-md">
                    {/* Hình ảnh bên trái */}
                    <Image source={{uri: imgUri}} className="w-[85px] h-[85px] rounded-lg mr-4"/>
                    <Image className={"mr-4"} source={require("@/assets/images/Voucher/voucher-slider.png")}/>
                    <View className={"flex-1"}>
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
    </View>
);
const ExpiringSoon = () => (
    <View className="flex-1 bg-gray-100 p-4">
        <View className="flex-row items-center">
            <Text className="text-xl font-bold mr-4">Sắp hết hạn</Text>
            <View className="bg-orange-500 rounded-full px-3 py-1 flex items-center justify-center">
                <Text className="text-white font-bold text-md">0</Text>
            </View>
        </View>
        <View className="flex-row items-center mt-4">
            <Text className="text-xl font-bold mr-4">Sẵn sàng sử dụng</Text>
            <View className="bg-orange-500 rounded-full px-3 py-1 flex items-center justify-center">
                <Text className="text-white font-bold text-md">1</Text>
            </View>
        </View>

        <View className={"flex-1 gap-3 mt-4"}>
            <TouchableOpacity>
                <View className="flex-row items-center bg-white rounded-xl px-4 shadow-md">
                    {/* Hình ảnh bên trái */}
                    <Image source={{uri: imgUri}} className="w-[85px] h-[85px] rounded-lg mr-4"/>
                    <Image className={"mr-4"} source={require("@/assets/images/Voucher/voucher-slider.png")}/>
                    <View className={"flex-1"}>
                        <Text className="text-sm font-bold text-black">
                            Giảm 30% Bánh Khi Mua Nước Size Lớn Nhất
                        </Text>
                        <Text className="text-xs text-[#E47905] mt-1">
                            Hết hạn 29/04/2024
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>


        </View>
    </View>
);


const renderScene = SceneMap({
    delivery: AvailableVouchers,
    takeaway: ExpiringSoon,
});

export default function MyVoucher() {
    const navigation = useNavigation();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: "delivery", title: "Giao hàng"},
        {key: "takeaway", title: "Mang đi"},
    ]);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Voucher của bạn",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);
    const screenWidth = Dimensions.get('window').width;
    const numberOfTabs = 2;
    const tabWidth = screenWidth / numberOfTabs;
    return (
        <TabView
            navigationState={{index, routes} as NavigationState<{ key: string; title: string }>} // Ép kiểu rõ ràng
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    indicatorStyle={{
                        backgroundColor: "orange",
                        width: 100,
                        marginLeft: (tabWidth - 100) / 2
                    }}
                    style={{backgroundColor: "white"}}
                    labelStyle={{color: "black", fontWeight: "bold"}}
                    activeColor="orange"
                    inactiveColor="gray"
                />
            )}
        />
    );
}
