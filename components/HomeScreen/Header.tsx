import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import BadgeButton from './BadgeButton';
import { Ticket, Bell } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import NotificationButton from './NotificationButton';
import { router, useFocusEffect } from 'expo-router';
import { useApi } from '@/hooks/useApi';
import apiService from '@/constants/config/axiosConfig';
import { IUser } from '@/constants/interface/user.interface';
import HeaderActions from '../common/HeaderActions';

export default function Header() {

    const [user, setUser] = useState<IUser>();


    const {
        loading: userLoading,
        errorMessage: userErrorMessage,
        callApi: callUserApi,
    } = useApi<void>();


    const fetchUserData = async () => {
        await callUserApi(async () => {
            const response = await apiService.get<IUser>(
                "/users/user_2tdF6nKWA3rQQP9n5mKrbt3x7x7"
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