import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';

export default function UpdateInfo() {
    const navigation = useNavigation();
    const [image, setImage] = useState<string | null>(null);


    const onImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
            console.log(result);
        }
        console.log(result)
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Cập nhật thông tin",
            headerShown: true,
            headerTitleAlign: 'center',
            heaerShadowVisible: true,
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        })
    }, [navigation])
    return (
        <View className={'py-5 px-7 h-full bg-white'}>
            <TouchableOpacity className={'mt-3'} onPress={() => onImagePick()}>
                {!image ?
                    <Image source={require('./../../assets/images/Profile/camera.png')}
                        className='w-[150px] h-[150px]'
                    />
                    :
                    <Image source={{ uri: image }}
                        className='w-[150px] h-[150px] rounded-2xl' />
                }
            </TouchableOpacity>

            <View className='mt-[10px]'>
                <TextInput placeholder='Họ' className='p-[10px] border border-gray-300 rounded-[10px] text-[18px] bg-white mt-[10px]' />
                <TextInput placeholder='Tên' className='p-[10px] border border-gray-300 rounded-[10px] text-[18px] bg-white mt-[15px]' />
                <TextInput placeholder='Email của bạn' className='p-[10px] border border-gray-300 rounded-[10px] text-[18px] bg-white mt-[15px]' />
            </View>
        </View>
    )
}