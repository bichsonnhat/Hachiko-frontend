import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ticket, Bell } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router, useFocusEffect } from 'expo-router';
import apiService from '@/constants/config/axiosConfig';
import { useApi } from '@/hooks/useApi';
import BadgeButton from '@/components/HomeScreen/BadgeButton';
import NotificationButton from '@/components/HomeScreen/NotificationButton';
import { useAuth } from '@clerk/clerk-expo';

export default function HeaderActions({ userId }: { userId: string }) {
    const [unseenCount, setUnseenCount] = useState<number>(0);

    const [voucherCount, setVoucherCount] = useState<number>(0);

    const {
        callApi: callNotificationApi,
        callApi: callVoucherApi,
    } = useApi<void>();

    const fetchNotificationData = async () => {
        await callNotificationApi(async () => {
            const response = await apiService.get(
                `/user-notifications/user/${userId}/unseen-count`
            );
            setUnseenCount(response.data);
        });
    };

    const fetchVoucherData = async () => {
        await callVoucherApi(async () => {
            const response = await apiService.get(`/user-vouchers/user/${userId}/available`);
            setVoucherCount(response.data.length);
        });
    };

    useEffect(() => {
        fetchNotificationData();
        fetchVoucherData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchNotificationData();
        }, [])
    );

    return (
        <View className="ml-auto flex flex-row">
            <BadgeButton
                className="mr-2"
                icon={<Ticket size={24} color={Colors.PRIMARY} />}
                text={voucherCount}
            />
            <TouchableOpacity onPress={() => router.push('/user-notification')}>
                <NotificationButton icon={<Bell size={24} color="black" />} count={unseenCount} />
            </TouchableOpacity>
        </View>
    );
}
