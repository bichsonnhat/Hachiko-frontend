import {View, Text, TouchableOpacity, FlatList, Image, Modal} from "react-native"
import {Plus, Edit, Calendar, Truck, Percent, DollarSign, Trash, TrashIcon} from "lucide-react-native"
import {router, useFocusEffect, useNavigation} from "expo-router"
import React, {useCallback, useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import apiService from "@/constants/config/axiosConfig"
import {IVoucher} from "@/constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function VouchersScreen() {
    const navigation = useNavigation()
    const [data, setData] = useState<IVoucher[]>([])
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null)
    const {
        loading: deleteVoucherLoading,
        errorMessage: deleteVoucherErrorMessage,
        callApi: deleteVoucherApi,
    } = useApi<void>();
    const handleDeletePress = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteModal(false);
        if (!selectedVoucher) return;
        try {
            await deleteVoucherApi(async () => {
                await apiService.delete(`/vouchers/${selectedVoucher.id}`);
            });
            fetchVouchersData();
        } catch (error) {
            console.error("Error deleting Voucher:", error);
        }
        finally {
            setSelectedVoucher(null);
        }
    };
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Quản lý voucher",
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: {
                borderBottomColor: "#000000",
                backgroundColor: "white",
            },
        })
    }, [navigation])

    const { loading: vouchersLoading, errorMessage: vouchersErrorMessage, callApi: callVouchersApi } = useApi<void>()

    const fetchVouchersData = async () => {
        await callVouchersApi(async () => {
            const { data } = await apiService.get("/vouchers")
            console.log("Fetched vouchers:", data)
            setData(data)
        })
    }

    useEffect(() => {
        fetchVouchersData()
    }, [])

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const isExpired = (expiryDate: Date) => {
        return new Date(expiryDate) < new Date()
    }
    useFocusEffect(
        useCallback(() => {
            fetchVouchersData();
        }, [])
    );
    const renderVoucherCard = ({ item }: { item: IVoucher }) => (
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header with image and basic info */}
            <View className="flex-row p-4">
                <Image
                    source={{ uri: item.imgUrl || "https://via.placeholder.com/60" }}
                    className="w-15 h-15 rounded-lg bg-gray-100"
                    resizeMode="cover"
                />
                <View className="flex-1 ml-4">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={1}>
                            {item.title}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedVoucher(item)
                                setShowDeleteModal(true)
                            }}
                            className="ml-2 p-2 rounded-full bg-red-50"
                        >
                            <TrashIcon size={18} color="red" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push(`/(dashboard)/voucher/edit/${item.id}`)}
                            className="ml-2 p-2 rounded-full bg-gray-50"
                        >
                            <Edit size={18} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
                        {item.description}
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <View className={`px-2 py-1 rounded-full ${isExpired(item.expiryDate) ? "bg-red-100" : "bg-green-100"}`}>
                            <Text className={`text-xs font-medium ${isExpired(item.expiryDate) ? "text-red-600" : "text-green-600"}`}>
                                {item.type}
                            </Text>
                        </View>
                        {isExpired(item.expiryDate) && (
                            <View className="ml-2 px-2 py-1 rounded-full bg-red-100">
                                <Text className="text-xs font-medium text-red-600">Hết hạn</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Discount Information */}
            <View className="px-4 pb-2">
                <View className="flex-row items-center space-x-4">
                    {item.discountPercent > 0 && (
                        <View className="flex-row items-center bg-orange-50 px-3 py-2 rounded-lg">
                            <Percent size={16} color="#EA580C" />
                            <Text className="ml-1 text-orange-600 font-semibold">-{item.discountPercent}%</Text>
                        </View>
                    )}
                    {item.discountPrice > 0 && (
                        <View className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg">
                            <DollarSign size={16} color="#2563EB" />
                            <Text className="ml-1 text-blue-600 font-semibold">-{formatCurrency(item.discountPrice)}</Text>
                        </View>
                    )}
                    {item.isFreeShip && (
                        <View className="flex-row items-center bg-green-50 px-3 py-2 rounded-lg">
                            <Truck size={16} color="#16A34A" />
                            <Text className="ml-1 text-green-600 font-semibold">Miễn phí ship</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Requirements and Expiry */}
            <View className="px-4 pb-4 border-t border-gray-50 pt-3 mt-2">
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        {item.minOrderPrice > 0 && (
                            <Text className="text-xs text-gray-500">Đơn tối thiểu: {formatCurrency(item.minOrderPrice)}</Text>
                        )}
                        {item.minOrderItem > 0 && (
                            <Text className="text-xs text-gray-500">Số lượng tối thiểu: {item.minOrderItem} sản phẩm</Text>
                        )}
                    </View>
                    <View className="flex-row items-center">
                        <Calendar size={14} color="#6B7280" />
                        <Text className={`ml-1 text-xs ${isExpired(item.expiryDate) ? "text-red-500" : "text-gray-500"}`}>
                            HSD: {formatDate(item.expiryDate)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )

    return (
        <View className="flex-1 bg-gray-50">
            {/* Add New Voucher Button */}
            <TouchableOpacity
                className="mx-4 mt-4 mb-2 flex-row items-center justify-center px-4 py-4 bg-blue-600 rounded-xl shadow-sm"
                onPress={() => router.push("/(dashboard)/voucher/create")}
            >
                <Plus size={24} color="white" />
                <Text className="ml-2 text-lg font-semibold text-white">Thêm voucher mới</Text>
            </TouchableOpacity>

            {/* Vouchers List */}
            {vouchersLoading ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Đang tải...</Text>
                </View>
            ) : data.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500 text-lg">Chưa có voucher nào</Text>
                    <Text className="text-gray-400 text-sm mt-2">Nhấn nút trên để thêm voucher mới</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id || Math.random().toString()}
                    renderItem={renderVoucherCard}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
                />
            )}

            {vouchersErrorMessage && (
                <View className="mx-4 mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
                    <Text className="text-red-600 text-center">{vouchersErrorMessage}</Text>
                </View>
            )}
            {/* Delete Confirmation Modal */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleDeleteCancel}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 15,
                        padding: 20,
                        width: '100%',
                        maxWidth: 350,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}>
                        <View style={{alignItems: 'center', marginBottom: 20}}>
                            <Icon name="alert-circle-outline" size={50} color="#ef4444" />
                        </View>

                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: 10,
                            color: '#1f2937'
                        }}>
                            Xác nhận xóa
                        </Text>

                        <Text style={{
                            fontSize: 16,
                            textAlign: 'center',
                            marginBottom: 25,
                            color: '#6b7280',
                            lineHeight: 22
                        }}>
                            Bạn có chắc chắn muốn xóa Voucher này không? Hành động này không thể hoàn tác.
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 15
                        }}>
                            <TouchableOpacity
                                onPress={handleDeleteCancel}
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: '#d1d5db',
                                    backgroundColor: 'white',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#6b7280'
                                }}>
                                    Hủy
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleDeleteConfirm}
                                disabled={deleteVoucherLoading}
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 10,
                                    backgroundColor: deleteVoucherLoading ? '#fca5a5' : '#ef4444',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: 'white'
                                }}>
                                    {deleteVoucherLoading ? 'Đang xóa...' : 'Xác nhận'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
