import apiService from '@/constants/config/axiosConfig';
import { CombinedNotification } from '@/constants/interface/combine-notification.interface';
import { INotification } from '@/constants/interface/notification.interface';
import { IUserNotification } from '@/constants/interface/user-notification.interface';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, FlatList, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationList() {
    const navigation = useNavigation();
    const [combinedNotifications, setCombinedNotifications] = useState<CombinedNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCombinedNotifications = async () => {
        setLoading(true);

        try {
            const userNotificationsResponse = await apiService.get<IUserNotification[]>(
                "/user-notifications/user/user_2tdF6nKWA3rQQP9n5mKrbt3x7x7"
            );

            const combined = await Promise.all(
                userNotificationsResponse.data.map(async (userNotif) => {
                    const notificationResponse = await apiService.get<INotification>(
                        `/notifications/${userNotif.notificationId}`
                    );

                    return {
                        id: userNotif.id,
                        title: notificationResponse.data.title,
                        description: notificationResponse.data.description,
                        date: notificationResponse.data.date,
                        imageUrl: notificationResponse.data.imageUrl,
                        isSeen: userNotif.isSeen
                    };
                })
            );

            setCombinedNotifications(combined);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCombinedNotifications();
        setRefreshing(false);
    };

    const markAllAsRead = async () => {
        try {
            const unreadNotifications = combinedNotifications.filter(notification => !notification.isSeen);

            if (unreadNotifications.length === 0) {
                Alert.alert("Thông báo", "Tất cả thông báo đã được đọc");
                return;
            }

            setLoading(true);

            await Promise.all(
                unreadNotifications.map(async (notification) => {
                    await apiService.put(`/user-notifications/${notification.id}`, {
                        isSeen: true
                    });
                })
            );

            setCombinedNotifications(
                combinedNotifications.map(notification => ({
                    ...notification,
                    isSeen: true
                }))
            );

            Alert.alert("Thành công", "Đã đánh dấu tất cả thông báo là đã đọc");
        } catch (error) {
            console.error('Error marking all as read:', error);
            Alert.alert("Lỗi", "Không thể đánh dấu tất cả là đã đọc");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await apiService.patch(`/user-notifications/${id}`, {
                isSeen: true
            });

            setCombinedNotifications(
                combinedNotifications.map(notification =>
                    notification.id === id
                        ? { ...notification, isSeen: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Hiển thị giờ nếu là ngày hôm nay
            return `Hôm nay, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else if (diffDays === 1) {
            return 'Hôm qua';
        } else if (diffDays < 7) {
            return `${diffDays} ngày trước`;
        } else {
            return date.toLocaleDateString('vi-VN');
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Thông báo`,
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: 'white',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 1.5,
                elevation: 3,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
    }, [navigation]);

    useEffect(() => {
        fetchCombinedNotifications();
    }, []);

    if (loading && !refreshing) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2 text-gray-500">Đang tải thông báo...</Text>
            </View>
        );
    }

    const hasUnreadNotifications = combinedNotifications.some(notification => !notification.isSeen);

    return (
        <View className="flex-1 bg-gray-50">
            <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
                <Text className="text-gray-500 font-medium text-base">
                    {combinedNotifications.length} thông báo
                </Text>
                <TouchableOpacity
                    onPress={markAllAsRead}
                    disabled={!hasUnreadNotifications}
                    className={`py-3 px-3 rounded-full ${hasUnreadNotifications ? 'bg-#[E47905]' : 'bg-gray-300'}`}
                >
                    <Text className="text-white text-base font-medium">
                        Đánh dấu tất cả đã đọc
                    </Text>
                </TouchableOpacity>
            </View>

            {combinedNotifications.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Ionicons name="notifications-off-outline" size={56} color="#cbd5e1" />
                    <Text className="mt-4 text-gray-500 text-lg">Không có thông báo nào</Text>
                </View>
            ) : (
                <FlatList
                    data={combinedNotifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 12 }}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className={`mb-3 p-4 ${item.isSeen ? 'bg-white' : 'bg-blue-50'}`}
                            style={{
                                borderRadius: 12,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.05,
                                shadowRadius: 3,
                                elevation: 2,
                                borderWidth: 1,
                                borderColor: item.isSeen ? '#f1f5f9' : '#e0f2fe',
                            }}
                            onPress={() => {
                                if (!item.isSeen) {
                                    markAsRead(item.id);
                                }
                                // Xử lý khi nhấn vào thông báo (chuyển trang, mở chi tiết,...)
                                console.log("Notification pressed:", item.id);
                            }}
                        >
                            <View className="flex-row items-start">
                                {/* Biểu tượng thông báo */}
                                <View className={`h-10 w-10 rounded-full justify-center items-center mr-3 ${item.isSeen ? 'bg-gray-100' : 'bg-blue-100'}`}>
                                    <Ionicons
                                        name="notifications"
                                        size={20}
                                        color={item.isSeen ? "#64748b" : "#3b82f6"}
                                    />
                                </View>

                                <View className="flex-1">
                                    <Text className={`font-bold text-base ${item.isSeen ? 'text-gray-700' : 'text-black'}`}>
                                        {item.title}
                                    </Text>
                                    <Text className="text-gray-600 mt-1 text-sm" numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                    <View className="flex-row justify-between items-center mt-2">
                                        <Text className="text-gray-400 text-xs">
                                            {formatDate(item.date)}
                                        </Text>
                                        {!item.isSeen && (
                                            <View className="flex-row items-center">
                                                <View className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                                                <Text className="text-xs text-blue-500 font-medium">Chưa đọc</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}