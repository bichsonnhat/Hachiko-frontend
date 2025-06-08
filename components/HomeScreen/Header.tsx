import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useApi } from '@/hooks/useApi';
import apiService from '@/constants/config/axiosConfig';
import { IUser } from '@/constants/interface/user.interface';
import HeaderActions from '../common/HeaderActions';
import { useAuth } from '@clerk/clerk-expo';

export default function Header() {

    const [user, setUser] = useState<IUser>();
    const { userId } = useAuth();

    const {
        loading: userLoading,
        errorMessage: userErrorMessage,
        callApi: callUserApi,
    } = useApi<void>();


    const fetchUserData = async () => {
        await callUserApi(async () => {
            const response = await apiService.get<IUser>(
                `/users/${userId}`
            );

            setUser(response.data);
        });
    };



    useEffect(() => {
        console.log('Header mounted');
        fetchUserData();
    }, []);


    return (
        <View className={"p-5 pt-10"}>
            <View className={"flex flex-row items-center"}>
                <Image source={require('@/assets/images/peach_tea.png')} />
                <Text className={"font-semibold "}>{user?.firstName} ơi, Hi-Tea đi!</Text>
                <HeaderActions />
            </View>
        </View>
    )
}