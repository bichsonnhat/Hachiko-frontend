import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import ShopModal from "@/components/ShopScreen/ShopModal";
import {IStore, Store} from "@/constants";

const StoreItem = ({store}: { store?: IStore }) => {
    const [modalVisible, setModalVisible] = useState(false);

    if (!store) {
        return <Text className="text-red-500">Lỗi: Không có dữ liệu cửa hàng</Text>;
    }
    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View className="bg-white rounded-xl p-4 flex-row items-center shadow-md mb-4">
                    <Image source={{uri: store.imageURL || ''}} className="w-[85px] h-[85px] rounded-lg mr-4"/>
                    <View>
                        <Text className="text-gray-700 font-semibold text-xs">THE HACHIKO COFFEE</Text>
                        <Text className="text-lg font-semibold">{store.name}</Text>
                        <View className={"h-[25px]"}></View>
                        <Text className="text-gray-500">Cách đây {store.distance} km</Text>
                    </View>

                </View>
            </TouchableOpacity>

            <ShopModal store={store} visible={modalVisible} onClose={() => setModalVisible(false)}/>

        </>


    );
};


export default StoreItem;