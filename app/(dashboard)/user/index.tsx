import { View, Text, TouchableOpacity, FlatList } from "react-native"
import { Plus, Edit, User, Mail, Phone, Calendar } from "lucide-react-native"
import {router, useFocusEffect, useLocalSearchParams, useNavigation} from "expo-router"
import React, { useEffect, useState } from "react"
import {useApi} from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import {IUser} from "@/constants/interface/user.interface";
import {IAdvertisement} from "@/constants/interface/advertisement.interface";

export default function UsersScreen() {
    const navigation = useNavigation()
    const [data, setData] = useState<IUser[]>([])

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Quản lý người dùng",
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: {
                borderBottomColor: "#e5e7eb",
                backgroundColor: "white",
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: "600",
                color: "#1f2937",
            },
        })
    }, [navigation])

    const params = useLocalSearchParams()
    const {
        loading: userLoading,
        errorMessage: userErrorMessage,
        callApi: callUserApi,
    } = useApi<void>();

    const fetchAdvertisementsData = async () => {
        await callUserApi(async () => {
            const { data } = await apiService.get<IUser[]>("/users");
            setData(data);
        });
    };
    useEffect(() => {
        fetchAdvertisementsData()
    }, [])

    const getInitials = (firstName: string, lastName: string) => {
        const firstInitial = firstName?.charAt(0) || ""
        const lastInitial = lastName?.charAt(0) || ""
        return `${firstInitial}${lastInitial}`.toUpperCase()
    }
    useFocusEffect(
        React.useCallback(() => {
            if (params?.updatedUser) {
                try {
                    const updated = JSON.parse(params.updatedUser as string) as IUser;

                    setData((prev) =>
                        prev.map((cat) => (cat.id === updated.id ? { ...cat, ...updated } : cat))
                    );
                } catch (err) {
                    console.warn("Lỗi parse updatedAdvertisement", err);
                }
            }
            if (params?.deletedUser) {
                const deletedId = params.deletedUser as string;
                setData((prev) =>
                    prev.filter((cat) => cat.id !== deletedId)
                );
            }
        }, [])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN")
    }

    const renderUserItem = ({ item }: { item: IUser }) => (
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <View className="p-4">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        {/* Avatar */}
                        <View
                            className="w-12 h-12 rounded-full items-center justify-center mr-4"
                            style={{ backgroundColor: "#f59e0b" }}
                        >
                            <Text className="text-white font-semibold text-lg">{getInitials(item.firstName, item.lastName)}</Text>
                        </View>

                        {/* User Info */}
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1">
                                <Text className="text-lg font-semibold text-gray-900 mr-2">
                                    {item.firstName} {item.lastName}
                                </Text>
                                {item.isAdmin && (
                                    <View className="bg-blue-100 px-2 py-1 rounded-full">
                                        <Text className="text-blue-800 text-xs font-medium">Admin</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-gray-500 text-sm mb-2">ID: {item.id}</Text>

                            {/* Contact Info */}
                            <View className="space-y-1">
                                <View className="flex-row items-center">
                                    <Mail size={14} color="#6b7280" />
                                    <Text className="text-gray-600 text-sm ml-2" numberOfLines={1}>
                                        {item.email}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Phone size={14} color="#6b7280" />
                                    <Text className="text-gray-600 text-sm ml-2">{item.phoneNumber}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Calendar size={14} color="#6b7280" />
                                    <Text className="text-gray-600 text-sm ml-2">
                                        {formatDate(item.birthDate)} • {item.gender}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Edit Button */}
                    <TouchableOpacity
                        onPress={() => router.push(`/(dashboard)/user/edit/${item.id}`)}
                        className="bg-gray-50 p-3 rounded-full ml-3"
                        activeOpacity={0.7}
                    >
                        <Edit size={20} color="#374151" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header Stats */}
            <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-center">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900">{data.length}</Text>
                        <Text className="text-gray-500 text-sm">Tổng người dùng</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-blue-600">{data.filter((user) => user.isAdmin).length}</Text>
                        <Text className="text-gray-500 text-sm">Quản trị viên</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-green-600">{data.filter((user) => !user.isAdmin).length}</Text>
                        <Text className="text-gray-500 text-sm">Người dùng</Text>
                    </View>
                </View>
            </View>


            {/* Users List */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderUserItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 16,
                    paddingBottom: 32,
                }}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center py-12">
                        <User size={48} color="#9ca3af" />
                        <Text className="text-gray-500 text-lg mt-4">Không có người dùng nào</Text>
                    </View>
                )}
            />
        </View>
    )
}
