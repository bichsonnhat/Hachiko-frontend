import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Edit, ChevronLeft } from "lucide-react-native";
import {router, useFocusEffect, useLocalSearchParams, useNavigation} from "expo-router";
import React, {useEffect, useState} from "react";
import {INotification} from "@/constants/interface/notification.interface";
import {useApi} from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import {ICategory} from "@/constants";



export default function NotificationsScreen() {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const params = useLocalSearchParams();

    const {
        loading: notificationLoading,
        errorMessage: notificationErrorMessage,
        callApi: callNotificationApi,
    } = useApi<void>();

    const fetchNotificationsData = async () => {
        await callNotificationApi(async () => {
            const { data } = await apiService.get("/notifications");
            console.log("Fetched notifications:", data);
            setNotifications(data);
        });
    };
    useEffect(() => {
        fetchNotificationsData();
    }, []);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Quản lý thông báo",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);
    useFocusEffect(
        React.useCallback(() => {
            if (params?.updatedNotification) {
                try {
                    const updated = JSON.parse(params.updatedNotification as string) as INotification;

                    setNotifications((prev) =>
                        prev.map((cat) => (cat.id === updated.id ? { ...cat, ...updated } : cat))
                    );
                } catch (err) {
                    console.warn("Lỗi parse updateNotification", err);
                }
            }
            if (params?.deletedCategory) {
                const deletedId = params.deletedCategory as string;
                setNotifications((prev) =>
                    prev.filter((cat) => cat.id !== deletedId)
                );
            }
        }, [])
    );

    return (
        <View className="flex-1 bg-white ">

            <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-300"
                onPress={() => router.push("/(dashboard)/notification/create")}
            >
                <Plus size={24} color="black" />
                <Text className="ml-2 text-lg font-medium">Thêm thông báo mới</Text>
            </TouchableOpacity>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="flex-row items-start justify-between px-4 py-3 border-b border-gray-300">
                        <View className="flex-row items-start flex-1 mr-3">
                            <Image
                                source={{ uri: item.imageUrl || "https://placehold.co/600x400" }}
                                className="w-10 h-10 rounded-full bg-yellow-200"
                            />
                            <View className="ml-3 flex-1">
                                <Text
                                    className="text-lg font-semibold"
                                    numberOfLines={0}
                                    style={{ flexWrap: 'wrap' }}
                                >
                                    {item.title}
                                </Text>
                                <Text
                                    className="text-gray-500 text-sm"
                                    numberOfLines={0}
                                    style={{ flexWrap: 'wrap' }}
                                >
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push(`/(dashboard)/notification/edit/${item.id}`)}
                            className="ml-2"
                        >
                            <Edit size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
    );
}
