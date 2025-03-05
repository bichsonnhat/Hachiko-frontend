import React from "react";
import {View, Text, TextInput, ScrollView, TouchableOpacity} from "react-native";
import StoreItem from "@/components/ShopScreen/StoreItem";
import ShopHeader from "@/components/ShopScreen/ShopHeader";
import {Store} from "@/constants";



const storesNearby: Store[] = [
    {
        id: 1,
        name: "HCM Cao Thắng",
        address: "4 - 6 Ấp Bắc, Q. Tân Bình, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.1,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    },
];

const otherStores: Store[] = [
    {
        id: 2,
        name: "HCM Lê Văn Sỹ",
        address: "4 - 6 Ấp Bắc, Q. Tân Bình, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.1,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    },
    {
        id: 3,
        name: "HCM Hoàng Việt",
        address: "4 - 6 Ấp Bắc, Q. Tân Bình, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.1,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    }, {
        id: 4,
        name: "HCM Hoàng Việt",
        address: "4 - 6 Ấp Bắc, Q. Tân Bình, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.1,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    }, {
        id: 5,
        name: "HCM Hoàng Việt",
        address: "4 - 6 Ấp Bắc, Q. Tân Bình, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.1,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    }, {
        id: 6,
        name: "HCM Hoàng Việt",
        address: "4 - 6 Ấp Bắc, Q. Tân Bình, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.1,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    }, {
        id: 7,
        name: "HCM Hoàng Việt",
        address: "4 - 6 Ấp Bắc, Q. Tân Bình, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.1,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    }, {
        id: 8,
        name: "HCM Hoàng Việt",
        address: "4 - 6 Ấp Bắc, Q. Tân Bình, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.1,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    },
];


export default function StoreScreen() {
    return (
            <View>
                <ShopHeader/>
                <View className="p-4">
                    <ScrollView className={"bg-gray-100"} showsVerticalScrollIndicator={false}>
                        <Text className="text-lg font-bold mb-2">Cửa hàng gần bạn</Text>
                        {storesNearby.map((store) => (
                            <StoreItem key={store.id} store={store}/>
                        ))}
                        <Text className="text-lg font-bold mt-4 mb-2">Các cửa hàng khác</Text>
                        {otherStores.map((store) => (
                            <StoreItem key={store.id} store={store}/>
                        ))}
                    </ScrollView>
                </View>
            </View>


    );
}