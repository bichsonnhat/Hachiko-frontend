import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Edit, ChevronLeft } from "lucide-react-native";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import React from "react";
import {IAdvertisement} from "@/constants/interface/advertisement.interface";

export default function AdvertisementScreen() {
    const navigation = useNavigation();
    const [advertisements, setAdvertisements] = useState<IAdvertisement[]>([]);
    const params = useLocalSearchParams();

    const {
        loading: advertisementLoading,
        errorMessage: advertisementErrorMessage,
        callApi: callAdvertisementApi,
    } = useApi<void>();

    const fetchAdvertisementsData = async () => {
        await callAdvertisementApi(async () => {
            const { data } = await apiService.get("/advertisements");
            setAdvertisements(data);
        });
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Quản lý quảng cáo",
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
            if (params?.updatedAdvertisement) {
                try {
                    const updated = JSON.parse(params.updatedAdvertisement as string) as IAdvertisement;

                    setAdvertisements((prev) =>
                        prev.map((cat) => (cat.id === updated.id ? { ...cat, ...updated } : cat))
                    );
                } catch (err) {
                    console.warn("Lỗi parse updatedAdvertisement", err);
                }
            }
            fetchAdvertisementsData()
        }, [])
    );

    useEffect(() => {
        fetchAdvertisementsData();
    }, []);


    return (
        <View className="flex-1 bg-white ">

            <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-300"
                onPress={() => router.push("/(dashboard)/advertisement/create")}
            >
                <Plus size={24} color="black" />
                <Text className="ml-2 text-lg font-medium">Thêm danh mục mới</Text>
            </TouchableOpacity>

            <FlatList
                data={advertisements}
                keyExtractor={(item) => item.id || ""}
                renderItem={({ item }) => (
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: item.imageUrl || "https://via.placeholder.com/40" }}
                                className="w-10 h-10 rounded-full bg-yellow-200"
                            />
                            <View className="ml-3 max-w-[220px]">
                                <Text className="whitespace-pre-line text-lg font-semibold">
                                    {item.description.replace(/\\n/g, '\n')}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => router.push(`/(dashboard)/advertisement/edit/${item.id}`)}>
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
