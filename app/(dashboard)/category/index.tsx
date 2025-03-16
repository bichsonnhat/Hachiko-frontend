import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Edit, ChevronLeft } from "lucide-react-native";
import {router, useNavigation} from "expo-router";
import {useEffect, useState} from "react";

const categories = [
    { id: "1", name: "Danh mục 1" },
    { id: "2", name: "Danh mục 2" },
    { id: "3", name: "Danh mục 3" },
    { id: "4", name: "Danh mục 4" },
    { id: "5", name: "Danh mục 5" },
    { id: "6", name: "Danh mục 6" },
    { id: "7", name: "Danh mục 7" },
    { id: "8", name: "Danh mục 8" },
];

export default function CategoryScreen() {
    const navigation = useNavigation();
    const [data, setData] = useState(categories);
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
    return (
        <View className="flex-1 bg-white ">

            {/* Nút Thêm danh mục */}
            <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-300"
                onPress={() => router.push("/(dashboard)/category/create")}
            >
                <Plus size={24} color="black" />
                <Text className="ml-2 text-lg font-medium">Thêm danh mục mới</Text>
            </TouchableOpacity>

            {/* Danh sách danh mục */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: "https://via.placeholder.com/40" }} // Ảnh placeholder
                                className="w-10 h-10 rounded-full bg-yellow-200"
                            />
                            <View className="ml-3">
                                <Text className="text-lg font-semibold">{item.name}</Text>
                                <Text className="text-gray-500 text-sm">ID danh mục {item.id}</Text>
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
