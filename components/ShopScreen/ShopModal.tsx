import React from "react";
import { View, Text, Image, TouchableOpacity, Modal, Dimensions, Linking } from "react-native";
import { Locate, Navigation } from "lucide-react-native";
import Slider from "@/components/HomeScreen/Slider";
import { IStore, Store } from "@/constants";
import { useRouter } from "expo-router";

interface ShopModalProps {
    store?: IStore;
    visible: boolean;
    onClose: () => void;
}
const { height } = Dimensions.get('window');

const openGoogleMaps = (store: IStore) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`;
    Linking.openURL(url);
};

const ShopModal: React.FC<ShopModalProps> = ({ visible, onClose, store }) => {
    const router = useRouter();
    return (
        <Modal visible={visible} animationType="slide" >
            <View className="flex-1 bg-white">
                {/* Ảnh */}
                <Image
                    source={{ uri: store?.imageURL }}
                    className="w-full"
                    style={{ height: height * 0.5 }}
                />


                {/* Nút đóng */}
                <TouchableOpacity
                    onPress={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full"
                >
                    <Text className=" text-lg font-bold">✕</Text>
                </TouchableOpacity>

                {/* Nội dung */}
                <View className="flex-1 px-5 py-6">
                    <Text className=" text-base ">Hachiko {store?.name}</Text>
                    <Text className="text-2xl mt-1 font-bold ">
                        {store?.address}
                    </Text>
                    <Text className="text-gray-500 text-base mt-1">Giờ mở cửa: 8:00 - 22:00</Text>
                    <View className={"flex-row items-center mt-5"} >
                        <Navigation size={24} color={"black"} />
                        <Text className=" text-lg ml-3">Cách đây {store?.distance} km</Text>
                    </View>

                </View>

                {/* Nút đặt hàng */}
                <TouchableOpacity className="bg-orange-500 p-5 items-center "
                    onPress={() => store && openGoogleMaps(store)}
                    disabled={!store}

                >
                    <Text className="text-white font-bold text-xl">Đến cửa hàng mua</Text>
                    <Text className="text-white opacity-80">Tự đến lấy tại cửa hàng này</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default ShopModal;
