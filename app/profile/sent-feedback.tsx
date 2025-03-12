import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'expo-router'

export default function SentFeedback() {
    const navigation = useNavigation()
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Gửi góp ý về ứng dụng",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        })
    }, [navigation])
    return (
        <View>
            <Text>sent-feedback</Text>
        </View>
    )
}