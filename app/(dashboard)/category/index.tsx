import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Edit, ChevronLeft } from "lucide-react-native";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { ICategory } from "@/constants";
import apiService from "@/constants/config/axiosConfig";
import React from "react";

export default function CategoryScreen() {
    const navigation = useNavigation();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const params = useLocalSearchParams();

    const {
        loading: categoryLoading,
        errorMessage: categoryErrorMessage,
        callApi: callCategoryApi,
    } = useApi<void>();

    const fetchCategoryData = async () => {
        await callCategoryApi(async () => {
            const { data } = await apiService.get("/categories");
            setCategories(data);
        });
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Quản lý danh mục",
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
            if (params?.updatedCategory) {
                try {
                    const updated = JSON.parse(params.updatedCategory as string) as ICategory;

                    setCategories((prev) =>
                        prev.map((cat) => (cat.id === updated.id ? { ...cat, ...updated } : cat))
                    );
                } catch (err) {
                    console.warn("Lỗi parse updatedCategory", err);
                }
            }
            fetchCategoryData()
        }, [])
    );

    useEffect(() => {
        fetchCategoryData();
    }, []);


    return (
        <View className="flex-1 bg-white ">

            <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-300"
                onPress={() => router.push("/(dashboard)/category/create")}
            >
                <Plus size={24} color="black" />
                <Text className="ml-2 text-lg font-medium">Thêm danh mục mới</Text>
            </TouchableOpacity>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id || ""}
                renderItem={({ item }) => (
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: item.imgUrl || "https://via.placeholder.com/40" }}
                                className="w-10 h-10 rounded-full bg-yellow-200"
                            />
                            <View className="ml-3">
                                <Text className="text-lg font-semibold">{item.name}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => router.push(`/(dashboard)/category/edit/${item.id}`)}>
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
