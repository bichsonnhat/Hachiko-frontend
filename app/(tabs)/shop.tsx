import React from "react";
import {View, Text, TextInput, ScrollView, TouchableOpacity} from "react-native";
import StoreItem from "@/components/ShopScreen/StoreItem";
import ShopHeader from "@/components/ShopScreen/ShopHeader";
import {Store} from "@/constants";



const storesNearby: Store[] = [
    {
        id: 2,
        name: "HCM Lê Văn Sỹ",
        address: "HCM Lê Văn Sỹ, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.7,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    },
];

const otherStores: Store[] = [
    {
        id: 2,
        name: "HCM Lê Văn Sỹ",
        address: "HCM Lê Văn Sỹ, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.7,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
    },
    {
        id: 3,
        name: "HCM Hoàng Việt",
        address: "HCM Hoàng Việt, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 0.7,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F57%20Xu%C3%A2n%20Th%E1%BB%A7y%2C%20Th%E1%BA%A3o%20%C4%90i%E1%BB%81n%2C%20Qu%E1%BA%ADn%202%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=8bcbecf5-22d5-4ddb-9567-e01ffecbd85b",
    },
    {
        id: 4,
        name: "HCM Sư Vạn Hạnh",
        address: "HCM Sư Vạn Hạnh, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 1.4,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F670%20Nguy%E1%BB%85n%20Duy%20Trinh%2C%20B%C3%ACnh%20Tr%C6%B0ng%20%C4%90%C3%B4ng%2C%20Qu%E1%BA%ADn%202%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=84026453-8103-4c84-afa7-985a3e2ba354",
    },
    {
        id: 5,
        name: "HCM Quang Trung",
        address: "HCM Quang Trung, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 1.45,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F75%20Nguy%E1%BB%85n%20V%C4%83n%20Th%C6%B0%C6%A1ng%2C%20Ph%C6%B0%E1%BB%9Dng%2025%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam.png?alt=media&token=2bdd2463-c315-4209-bf66-76060dc918b9 ",
    },
    {
        id: 6,
        name: "HCM Ngô Tất Tố",
        address: "HCM Ngô Tất Tố, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 2.36,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2FT%E1%BA%A7ng%201%20D%E1%BB%B1%20%C3%A1n%20Chung%20c%C6%B0%20cao%20c%E1%BA%A5p%20Homyland%20Riverside%2C%20%C4%90.%20Nguy%E1%BB%85n%20Duy%20Trinh%2C%20P.%20B%C3%ACnh%20Tr%C6%B0ng%20T%C3%A2y%2C%20Qu%E1%BA%ADn%202%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=94f584d3-53b7-44ac-bc1e-b4c6e9f5ad9d",
    },
    {
        id: 7,
        name: "HCM Hậu Giang",
        address: "HCM Hậu Giang, Hồ Chí Minh",
        open_time: new Date(),
        close_time: new Date(),
        distance: 6.09,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F75%20Nguy%E1%BB%85n%20V%C4%83n%20Th%C6%B0%C6%A1ng%2C%20Ph%C6%B0%E1%BB%9Dng%2025%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam.png?alt=media&token=2bdd2463-c315-4209-bf66-76060dc918b9 ",
    },
    {
        id: 8,
        name: "HN Hai Bà Trưng",
        address: "HN Hai Bà Trưng, Hà Nội",
        open_time: new Date(),
        close_time: new Date(),
        distance: 1131.61,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F670%20Nguy%E1%BB%85n%20Duy%20Trinh%2C%20B%C3%ACnh%20Tr%C6%B0ng%20%C4%90%C3%B4ng%2C%20Qu%E1%BA%ADn%202%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=84026453-8103-4c84-afa7-985a3e2ba354",
    },
    {
        id: 9,
        name: "HN Kim Mã",
        address: "HN Kim Mã, Hà Nội",
        open_time: new Date(),
        close_time: new Date(),
        distance: 1136.88,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F57%20Xu%C3%A2n%20Th%E1%BB%A7y%2C%20Th%E1%BA%A3o%20%C4%90i%E1%BB%81n%2C%20Qu%E1%BA%ADn%202%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=8bcbecf5-22d5-4ddb-9567-e01ffecbd85b",
    },
    {
        id: 10,
        name: "HN Bà Triệu",
        address: "HN Bà Triệu, Hà Nội",
        open_time: new Date(),
        close_time: new Date(),
        distance: 1154.57,
        image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2FT%E1%BA%A7ng%201%20D%E1%BB%B1%20%C3%A1n%20Chung%20c%C6%B0%20cao%20c%E1%BA%A5p%20Homyland%20Riverside%2C%20%C4%90.%20Nguy%E1%BB%85n%20Duy%20Trinh%2C%20P.%20B%C3%ACnh%20Tr%C6%B0ng%20T%C3%A2y%2C%20Qu%E1%BA%ADn%202%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=94f584d3-53b7-44ac-bc1e-b4c6e9f5ad9d",
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