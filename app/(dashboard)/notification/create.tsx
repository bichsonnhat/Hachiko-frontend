import {View,Text} from "react-native";
import {useNavigation} from "expo-router";
import {useEffect} from "react";

export default function CreateNotification (){
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Thêm thông báo mới",
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
            <Text>Add Notification</Text>
        </View>
    );
}