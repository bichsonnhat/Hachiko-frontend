import { View, Text } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function CreateUser() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Thêm người dùng mới",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);
    return (
        <View className={"flex-1 bg-white "}>
            <Text>Add User</Text>
        </View>
    );
}