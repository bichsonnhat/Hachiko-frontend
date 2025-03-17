import {View,Text} from "react-native";
import {useNavigation} from "expo-router";
import {useEffect} from "react";

export default function CreateVoucher (){
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Thêm voucher mới",
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
            <Text>Add Voucher</Text>
        </View>
    );
}