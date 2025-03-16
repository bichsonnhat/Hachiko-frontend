import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Edit, ChevronLeft } from "lucide-react-native";
import {router, useNavigation} from "expo-router";
import {useEffect, useState} from "react";

const users = [
    { id: "1", name: "Người dùng 1" },
    { id: "2", name: "Người dùng 2" },
    { id: "3", name: "Người dùng 3" },
    { id: "4", name: "Người dùng 4" },
    { id: "5", name: "Người dùng 5" },
    { id: "6", name: "Người dùng 6" },
    { id: "7", name: "Người dùng 7" },
    { id: "8", name: "Người dùng 8" },
];

export default function UsersScreen() {
    const navigation = useNavigation();
    const [data, setData] = useState(users);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Quản lý người dùng",
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

            <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-300"
                onPress={() => router.push("/(dashboard)/user/create")}
            >
                <Plus size={24} color="black" />
                <Text className="ml-2 text-lg font-medium">Thêm người dùng mới</Text>
            </TouchableOpacity>

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
                                <Text className="text-gray-500 text-sm">ID user {item.id}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => router.push(`/(dashboard)/user/edit/${item.id}`)}>
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
