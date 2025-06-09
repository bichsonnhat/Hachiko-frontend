import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {SafeAreaView, StyleSheet, StatusBar, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator} from "react-native";
import {Colors} from "@/constants/Colors";
import {Ticket} from "lucide-react-native";
import React, {useState, useEffect} from "react";
import VoucherDetailModal from "@/components/VoucherScreen/VoucherDetailModal";
import { useRouter} from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import apiService from "@/constants/config/axiosConfig";

// Interface for user voucher mapping (from previous API)
interface UserVoucher {
    id: string;
    userId: string;
    voucherId: string;
    createdAt: string;
    updatedAt: string;
    status: string;
}

// Interface for voucher details (from the new API)
// Must match the interface in VoucherDetailModal
interface Voucher {
    id: string;
    title: string;
    description: string;
    imgUrl: string;
    discountPrice: number;
    discountPercent: number;
    isFreeShip: boolean;
    minOrderPrice: number;
    minOrderItem: number;
    type: string;
    expiryDate: string;
}

export default function CouponScreen() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [userVoucherMappings, setUserVoucherMappings] = useState<UserVoucher[]>([]);
    const [voucherDetails, setVoucherDetails] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();

    const safeHeight = StatusBar.currentHeight || 0;
    
    useEffect(() => {
        if (userId) {
            console.log("userId", userId);
            fetchUserVouchers();
        }
    }, [userId]);

    // Fetch user's voucher mappings
    const fetchUserVouchers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Using the endpoint from previous example to get user-voucher mappings
            const { data: mappings } = await apiService.get<UserVoucher[]>(`/user-vouchers/user/${userId}/available`);
            setUserVoucherMappings(mappings);
            
            // Extract voucher IDs from the mappings
            const voucherIds = mappings.map((mapping: UserVoucher) => mapping.voucherId);
            
            // If we have voucher IDs, fetch the detailed voucher information
            if (voucherIds.length > 0) {
                await fetchVoucherDetails(voucherIds);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching user vouchers:', error);
            setError('Failed to load vouchers. Please try again later.');
            setLoading(false);
        }
    };

    // Fetch detailed voucher information by IDs
    const fetchVoucherDetails = async (voucherIds: string[]) => {
        try {
            // Using the endpoint shown in the API documentation for getting vouchers
            // For multiple vouchers, we can make individual requests or use a combined approach
            if (voucherIds.length === 1) {
                // For a single voucher, use the direct endpoint
                const { data } = await apiService.get<Voucher>(`/vouchers/${voucherIds[0]}`);
                setVoucherDetails([data]);
            } else {
                // For multiple vouchers, we'll collect all the results
                const voucherPromises = voucherIds.map(id => 
                    apiService.get<Voucher>(`/vouchers/${id}`).then(response => response.data)
                );
                
                const voucherResults = await Promise.all(voucherPromises);
                setVoucherDetails(voucherResults);
            }
        } catch (error) {
            console.error('Error fetching voucher details:', error);
            setError('Failed to load voucher details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleVoucherPress = (voucher: Voucher) => {
        setSelectedVoucher(voucher);
        setModalVisible(true);
    };

    // Get vouchers that are expiring soon (within 7 days)
    const getExpiringSoonVouchers = () => {
        if (voucherDetails.length === 0) return [];
        
        const now = new Date();
        const sevenDaysLater = new Date(now);
        sevenDaysLater.setDate(now.getDate() + 7);
        
        return voucherDetails.filter(voucher => {
            const expiryDate = new Date(voucher.expiryDate);
            return expiryDate > now && expiryDate <= sevenDaysLater;
        });
    };

    const expiringSoonVouchers = getExpiringSoonVouchers();

    // Render loading spinner
    if (loading) {
        return (
            <SafeAreaView style={{flex: 1, marginTop: safeHeight}}>
                <View className="px-4 bg-[#ff9123]">
                    <View className="flex-row py-2 items-center">
                        <Text className="flex-1 text-xl font-bold text-white">Ưu đãi</Text>
                    </View>
                </View>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={Colors.PRIMARY} />
                    <Text className="mt-4 text-gray-500">Loading vouchers...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Render error state
    if (error) {
        return (
            <SafeAreaView style={{flex: 1, marginTop: safeHeight}}>
                <View className="px-4 bg-[#ff9123]">
                    <View className="flex-row py-2 items-center">
                        <Text className="flex-1 text-xl font-bold text-white">Ưu đãi</Text>
                    </View>
                </View>
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-red-500 text-center">{error}</Text>
                    <TouchableOpacity 
                        className="mt-4 bg-[#E47905] py-2 px-4 rounded-lg"
                        onPress={fetchUserVouchers}
                    >
                        <Text className="text-white font-bold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{flex: 1, marginTop: safeHeight}}>
            <View className={"px-4 bg-[#ff9123]"}>
                <View className={"flex-row py-2 items-center"}>
                    <Text className={"flex-1 text-xl font-bold text-white"}>Ưu đãi</Text>
                    <TouchableOpacity>
                        <ThemedView
                            className={`flex-row h-12 items-center bg-white rounded-full px-4 py-2 shadow-md shadow-slate-600 `}>
                            <Ticket size={24} color={Colors.PRIMARY}/>
                            <Text className={'font-bold ml-2 text-[#E47905] text-lg'}>Voucher của tôi</Text>
                        </ThemedView>
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Expiring Soon Section - only show if there are expiring vouchers */}
            {expiringSoonVouchers.length > 0 && (
                <>
                    <View className={"bg-gray-100 px-4 flex-row py-2 items-center"}>
                        <Text className={"flex-1 text-xl font-bold"}>Sắp hết hạn</Text>
                        <TouchableOpacity onPress={() => router.push('/voucher/my-voucher')}>
                            <View className={`flex-row h-12 items-center bg-[#fff7e3] rounded-full px-4 py-2 `}>
                                <Text className={'font-bold ml-2 text-[#ffa145] text-lg'}>Xem tất cả</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Expiring Soon Vouchers */}
                    <View className={"bg-gray-100 px-4 py-2"}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
                            {expiringSoonVouchers.map((voucher) => (
                                <TouchableOpacity key={`expiring-${voucher.id}`} onPress={() => handleVoucherPress(voucher)}>
                                    <View className="bg-white rounded-xl p-2 shadow-md w-64 mr-3">
                                        <Image 
                                            source={{uri: voucher.imgUrl}} 
                                            className="w-full h-32 rounded-lg" 
                                            resizeMode="cover"
                                        />
                                        <View className="p-2">
                                            <Text className="text-sm font-bold text-black">{voucher.title}</Text>
                                            <Text className="text-xs text-[#E47905] mt-1">
                                                Hết hạn {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </>
            )}
            
            {/* All Vouchers Section - only show if there are vouchers */}
            {voucherDetails.length > 0 ? (
                <>
                    <View className={"flex-row py-2 items-center bg-gray-100 px-4 "}>
                        <Text className={"flex-1 text-xl font-bold"}>Voucher của bạn</Text>
                        <TouchableOpacity onPress={() => router.push('/voucher/my-voucher')}>
                            <View className={`flex-row h-12 items-center bg-[#fff7e3] rounded-full px-4 py-2 `}>
                                <Text className={'font-bold ml-2 text-[#ffa145] text-lg'}>Xem tất cả</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    {/* All Vouchers List */}
                    <View className={"flex-1 bg-gray-100 px-4 gap-3"}>
                        {voucherDetails.map((voucher) => (
                            <TouchableOpacity key={voucher.id} onPress={() => handleVoucherPress(voucher)}>
                                <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-md">
                                    <Image 
                                        source={{uri: voucher.imgUrl}} 
                                        className="w-[85px] h-[85px] rounded-lg mr-4"
                                    />
                                    <Image className={"mr-4"} source={require("@/assets/images/Voucher/voucher-slider.png")}/>
                                    <View className={"flex-1"} >
                                        <Text className="text-sm font-bold text-black">
                                            {voucher.title}
                                        </Text>
                                        <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
                                            {voucher.description}
                                        </Text>
                                        <Text className="text-xs text-[#E47905] mt-1">
                                            Hết hạn {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            ) : (
                <View className="flex-1 bg-gray-100 justify-center items-center">
                    <Text className="text-gray-500 text-center">No vouchers available</Text>
                </View>
            )}
            
            {/* Modal only shows when a voucher is selected */}
            <VoucherDetailModal 
                visible={modalVisible} 
                voucher={selectedVoucher}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedVoucher(null);
                }}
            />
        </SafeAreaView>
    );
}

