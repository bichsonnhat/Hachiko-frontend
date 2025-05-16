import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Edit, ChevronLeft } from "lucide-react-native";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { IProduct } from "@/constants";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import React from "react";

const PAGE_SIZE = 11;

export default function ProductsScreen() {
    const navigation = useNavigation();
    const [products, setProducts] = useState<IProduct[]>([]);
    const params = useLocalSearchParams();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const {
        loading: productLoading,
        errorMessage: productErrorMessage,
        callApi: callProductApi,
    } = useApi<void>();

    const fetchProductData = async (pageNum: number = 1) => {
        await callProductApi(async () => {
            const { data } = await apiService.get<IProduct[]>(
                `/products?page=${pageNum}&pageSize=${PAGE_SIZE}`
            );

            setProducts(prev => {
                if (pageNum === 1) return data;


                const existingIds = new Set(prev.map(p => p.id));
                const newData = data.filter(p => !existingIds.has(p.id));
                return [...prev, ...newData];
            });

            setPage(pageNum);
            setHasMore(data.length >= PAGE_SIZE);
            setIsFetchingMore(false);
        });
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Quản lý sản phẩm",
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
            if (params?.updatedProduct) {
                try {
                    const updated = JSON.parse(params.updatedProduct as string) as IProduct;

                    setProducts((prev) =>
                        prev.map((cat) => (cat.id === updated.id ? { ...cat, ...updated } : cat))
                    );
                } catch (err) {
                    console.warn("Lỗi parse updatedProduct", err);
                }
            }
        }, [])
    );

    const loadMoreProducts = () => {
        if (!hasMore || isFetchingMore || productLoading) return;

        const nextPage = page + 1;
        setIsFetchingMore(true);
        fetchProductData(nextPage);
    };

    useEffect(() => {
        fetchProductData(1);
    }, []);
    return (
        <View className="flex-1 bg-white ">

            <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-300"
                onPress={() => router.push("/(dashboard)/product/create")}
            >
                <Plus size={24} color="black" />
                <Text className="ml-2 text-lg font-medium">Thêm sản phẩm mới</Text>
            </TouchableOpacity>

            {productErrorMessage ? (
                <View className="p-4 bg-red-100 rounded-lg mb-4">
                    <Text className="text-red-500 text-center">{productErrorMessage}</Text>
                </View>
            ) : null}

            {productLoading && page === 1 ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => (item.id !== undefined ? item.id.toString() : Math.random().toString())}
                    renderItem={({ item }) => (
                        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
                            <View className="flex-row items-center">
                                <Image
                                    source={{ uri: item.imageUrl || "https://via.placeholder.com/40" }}
                                    className="w-10 h-10 rounded-full bg-yellow-200"
                                />
                                <View className="ml-3">
                                    <Text className="text-lg font-semibold">{item.title}</Text>
                                    <Text className="text-gray-500 text-sm">Giá: {item.price}đ</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => router.push(`/(dashboard)/product/edit/${item.id}`)}>
                                <Edit size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                    onEndReached={loadMoreProducts}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        productLoading && page > 1 ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : null
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 16 }}
                />
            )}

        </View>
    );
}
