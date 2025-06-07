import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Edit, ChevronLeft } from "lucide-react-native";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { IStore } from "@/constants";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import React from "react";

export default function StoresScreen() {
    const navigation = useNavigation();
    const [stores, setStores] = useState<IStore[]>([]);
    const params = useLocalSearchParams();

    const {
        loading: storeLoading,
        errorMessage: storeErrorMessage,
        callApi: callStoreApi,
    } = useApi<void>();

    const fetchStoreData = async () => {
        await callStoreApi(async () => {
            const { data } = await apiService.get("/stores");
            setStores(data);
        });
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Quản lý cửa hàng",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            if (params?.updatedStore) {
                try {
                    const updated = JSON.parse(params.updatedStore as string) as IStore;

                    setStores((prev) =>
                        prev.map((cat) => (cat.id === updated.id ? { ...cat, ...updated } : cat))
                    );
                } catch (err) {
                    console.warn("Lỗi parse updatedStore", err);
                }
            }
        }, [])
    );

    useEffect(() => {
        fetchStoreData();
    }, []);
    return (
        <View className="flex-1 bg-white ">

            <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-300"
                onPress={() => router.push("/(dashboard)/store/create")}
            >
                <Plus size={24} color="black" />
                <Text className="ml-2 text-lg font-medium">Thêm cửa hàng mới</Text>
            </TouchableOpacity>

            <FlatList
                data={stores}
                keyExtractor={(item) => item.id || ""}
                renderItem={({ item }) => (
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: item.imageURL || "https://via.placeholder.com/40" }}
                                className="w-10 h-10 rounded-full bg-yellow-200"
                            />
                            <View className="ml-3 w-[280px]">
                                <Text className="text-lg font-semibold">{item.name}</Text>
                                <Text
                                    className="text-gray-500 text-sm "
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    Địa chỉ: {item.address}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => router.push(`/(dashboard)/store/edit/${item.id}`)}>
                            <Edit size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
    );
}
