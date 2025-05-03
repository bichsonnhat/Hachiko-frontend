import React, { useEffect, useState } from 'react';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, Image, View, ActivityIndicator } from 'react-native';
import { useApi } from '@/hooks/useApi';
import { IAdvertisement } from '@/constants/interface/advertisement.interface';
import apiService from '@/constants/config/axiosConfig';

export default function AdvertisementDetail() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [advertisement, setAdvertisement] = useState<IAdvertisement>();

    const {
        loading: advertisementLoading,
        errorMessage: advertisementErrorMessage,
        callApi: callAdvertisementApi,
    } = useApi<void>();

    const fetchAdvertisementData = async () => {
        await callAdvertisementApi(async () => {
            const response = await apiService.get<IAdvertisement>(
                `/advertisements/${id}`
            );

            setAdvertisement(response.data);
        });
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Chi tiết sự kiện`,
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);

    useEffect(() => {
        fetchAdvertisementData();
    }, []);

    useEffect(() => {
        if (advertisementErrorMessage) {
            console.error("❌ Lỗi khi lấy chi tiết sự kiện:", advertisementErrorMessage);
        }
    }, [advertisementErrorMessage]);

    return (
        <ScrollView className="flex-1 bg-white p-6">
            {advertisementLoading ? (
                <View className="flex-1 items-center justify-center h-full mt-5">
                    <ActivityIndicator size="large" color="#FF8C00" />
                </View>
            ) : (
                <>
                    <Image
                        source={{ uri: advertisement?.imageUrl }}
                        className="w-full h-64 rounded-lg mb-4"
                    />
                    <Text className="text-[15px] font-semibold leading-6 text-gray-700">
                        {advertisement?.description?.replace(/\\n/g, '\n')}
                    </Text>
                </>
            )}
        </ScrollView>
    );
}
