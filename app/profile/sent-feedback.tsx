import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'

export default function SentFeedback() {
    const navigation = useNavigation()
    const [feedback, setFeedback] = useState("");
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
        <View className='flex-1 bg-white px-5'>
            <Text className='font-bold  mt-5 text-[15px]'>Đối với Hachiko, mọi góp ý của bạn đều quý giá 💛️</Text>
            <TextInput
                className='h-[150px] border border-[#ccc] rounded-[8px] p-[10px] text-[15px] mt-5'
                multiline
                placeholder="Chia sẻ cảm nghĩ của bạn về ứng dụng tại đây"
                value={feedback}
                onChangeText={setFeedback}
                textAlignVertical="top"
            />
        </View>
    )
}