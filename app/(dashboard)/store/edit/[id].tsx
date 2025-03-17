import { View, Text } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function EditStore() {
    const { id } = useLocalSearchParams(); // Lấy id từ URL
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Sửa thông tin cửa hàng ${id}`,
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: {
                borderBottomColor: "#000000",
                backgroundColor: "white",
            },
        });
    }, [navigation, id]);

    return (
        <View className="flex-1 bg-white p-4">
            <Text className="text-xl font-bold">Sửa thông tin cửa hàng {id}</Text>
        </View>
    );
}
