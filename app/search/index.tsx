import { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useApi } from '@/hooks/useApi';
import apiService from '@/constants/config/axiosConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrinkSlotHorizontal } from '@/components/OrderScreen/DrinkSlotHorizontal';
import { ICategory, IProduct } from '@/constants'; // Assuming these interfaces exist
import { useDebounce } from '@/hooks/useDebounce';

// Define interface for API response
interface ProductsResponse {
    items: IProduct[];
    total: number;
    page: number;
    pages: number;
}

export default function SearchScreen() {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState<IProduct[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const {
        loading,
        errorMessage,
        callApi,
    } = useApi<void>();

    const {
        loading: categoryLoading,
        errorMessage: categoryErrorMessage,
        callApi: callCategoryApi,
    } = useApi<void>();

    const fetchProducts = async (searchValue: string, pageNum: number = 1) => {
        await callApi(async () => {
            const { data } = await apiService.get<ProductsResponse>(
                `/products?search=${encodeURIComponent(searchValue)}&page=${pageNum}`
            );
            if (pageNum === 1) {
                setProducts(data.items || []);
            } else {
                setProducts(prev => [...prev, ...(data.items || [])]);
            }
            setTotalPages(data.pages || 1);
        });
    };

    const fetchCategoryData = async () => {
        await callCategoryApi(async () => {
            const { data } = await apiService.get<ICategory[]>("/categories");
            setCategories(data);
        });
    };

    const debouncedSearchText = useDebounce(searchText, 500);

    useEffect(() => {
        if (debouncedSearchText.trim() === '') {
            setProducts([]);
            return;
        }
        fetchProducts(debouncedSearchText);
        fetchCategoryData();
    }, [debouncedSearchText]);

    const loadMoreProducts = () => {
        if (page < totalPages && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProducts(debouncedSearchText, nextPage);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const checkHasTopping = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.hasToppings : false;
    };

    const isNoResults = debouncedSearchText.trim() !== '' && products.length === 0 && !loading;

    return (
        <SafeAreaView className="flex-1 p-4 bg-white">
            <View className="flex-row items-center mb-4 gap-3">
                {/* <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity> */}
                <View className="flex-1 flex-row items-center border border-gray-600 rounded-xl px-3 gap-2">
                    <Search size={20} color="gray" />
                    <TextInput
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchText}
                        onChangeText={setSearchText}
                        className="flex-1 py-4 text-xl"
                        autoFocus
                    />
                </View>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className='text-[#FF8C00] font-bold'>Hủy</Text>
                </TouchableOpacity>
            </View>

            {errorMessage ? (
                <View className="p-4 bg-red-100 rounded-lg mb-4">
                    <Text className="text-red-500 text-center">{errorMessage}</Text>
                    <TouchableOpacity
                        onPress={() => fetchProducts(debouncedSearchText)}
                        className="mt-2"
                    >
                        <Text className="text-blue-500 text-center">Thử lại</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            {loading && page === 1 ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : (
                <>
                    {isNoResults ? (
                        <Text className="text-center text-gray-500 mt-8">
                            Không tìm thấy sản phẩm phù hợp.
                        </Text>
                    ) : (
                        <FlatList
                            data={products}
                            keyExtractor={(item, index) => item.id ? item.id.toString() : `item-${index}`}
                            renderItem={({ item }) => (
                                <View className="p-2 rounded-lg">
                                    <DrinkSlotHorizontal drink={item} check={checkHasTopping} />
                                </View>
                            )}
                            onEndReached={loadMoreProducts}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                loading && page > 1 ? (
                                    <ActivityIndicator size="small" color="#000" />
                                ) : null
                            }
                        />
                    )}
                </>
            )}
        </SafeAreaView>
    );
}