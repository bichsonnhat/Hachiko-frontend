import React, {useEffect, useState} from "react";
import {View, Text, FlatList, Dimensions, TouchableOpacity, Image, ActivityIndicator} from "react-native";
import {TabView, SceneMap, TabBar, NavigationState} from "react-native-tab-view";
import {useNavigation} from "expo-router";
import {ThemedView} from "@/components/ThemedView";
import VoucherDetailModal from "@/components/VoucherScreen/VoucherDetailModal";
import { useAuth } from "@clerk/clerk-expo";
import apiService from "@/constants/config/axiosConfig";
import { Colors } from "@/constants/Colors";

// Interface for user voucher mapping
interface UserVoucher {
    id: string;
    userId: string;
    voucherId: string;
    createdAt: string;
    updatedAt: string;
    status: string;
}

// Interface for voucher details
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

const AvailableVouchers = () => {
    const { userId } = useAuth();
    const [userVoucherMappings, setUserVoucherMappings] = useState<UserVoucher[]>([]);
    const [voucherDetails, setVoucherDetails] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    useEffect(() => {
        if (userId) {
            fetchUserVouchers();
        }
    }, [userId]);

    // Fetch user's voucher mappings
    const fetchUserVouchers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get user-voucher mappings
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
            // For multiple vouchers, we'll collect all the results
            const voucherPromises = voucherIds.map(id => 
                apiService.get<Voucher>(`/vouchers/${id}`).then(response => response.data)
            );
            
            const voucherResults = await Promise.all(voucherPromises);
            
            // Filter to only show non-pickup (delivery) vouchers in this tab
            const deliveryVouchers = voucherResults.filter(voucher => voucher.type !== 'Pickup');
            setVoucherDetails(deliveryVouchers);
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

    if (loading) {
        return (
            <View className="flex-1 bg-gray-100 p-4 justify-center items-center">
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text className="mt-4 text-gray-500">Loading vouchers...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-gray-100 p-4 justify-center items-center">
                <Text className="text-red-500 text-center">{error}</Text>
                <TouchableOpacity 
                    className="mt-4 bg-[#E47905] py-2 px-4 rounded-lg"
                    onPress={fetchUserVouchers}
                >
                    <Text className="text-white font-bold">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <View className="flex-row items-center">
                <Text className="text-xl font-bold mr-4">Sẵn sàng sử dụng</Text>
                <View className="bg-orange-500 rounded-full px-3 py-1 flex items-center justify-center">
                    <Text className="text-white font-bold text-md">{voucherDetails.length}</Text>
                </View>
            </View>

            <View className={"flex-1 gap-3 mt-4"}>
                {voucherDetails.length > 0 ? (
                    <FlatList
                        data={voucherDetails}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => handleVoucherPress(item)}>
                                <ThemedView className="flex-row items-center bg-white rounded-xl px-4 shadow-md py-3">
                                    <Image source={{uri: item.imgUrl}} className="w-[85px] h-[85px] rounded-lg mr-4"/>
                                    <Image className={"mr-4"} source={require("@/assets/images/Voucher/voucher-slider.png")}/>
                                    <View className={"flex-1"}>
                                        <Text className="text-sm font-bold text-black">
                                            {item.title}
                                        </Text>
                                        <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                        <Text className="text-xs text-[#E47905] mt-1">
                                            Hết hạn {new Date(item.expiryDate).toLocaleDateString("vi-VN")}
                                        </Text>
                                    </View>
                                </ThemedView>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{gap: 12}}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-500">Không có voucher nào</Text>
                    </View>
                )}
            </View>
            
            <VoucherDetailModal 
                visible={modalVisible} 
                voucher={selectedVoucher}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedVoucher(null);
                }}
            />
        </View>
    );
};

const ExpiringSoon = () => {
    const { userId } = useAuth();
    const [userVoucherMappings, setUserVoucherMappings] = useState<UserVoucher[]>([]);
    const [voucherDetails, setVoucherDetails] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    useEffect(() => {
        if (userId) {
            fetchUserVouchers();
        }
    }, [userId]);

    // Fetch user's voucher mappings
    const fetchUserVouchers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get user-voucher mappings
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
            // For multiple vouchers, we'll collect all the results
            const voucherPromises = voucherIds.map(id => 
                apiService.get<Voucher>(`/vouchers/${id}`).then(response => response.data)
            );
            
            const voucherResults = await Promise.all(voucherPromises);
            
            // Filter to only show pickup vouchers in this tab
            const pickupVouchers = voucherResults.filter(voucher => voucher.type === 'Pickup');
            setVoucherDetails(pickupVouchers);
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

    if (loading) {
        return (
            <View className="flex-1 bg-gray-100 p-4 justify-center items-center">
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text className="mt-4 text-gray-500">Loading vouchers...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-gray-100 p-4 justify-center items-center">
                <Text className="text-red-500 text-center">{error}</Text>
                <TouchableOpacity 
                    className="mt-4 bg-[#E47905] py-2 px-4 rounded-lg"
                    onPress={fetchUserVouchers}
                >
                    <Text className="text-white font-bold">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <View className="flex-row items-center">
                <Text className="text-xl font-bold mr-4">Sắp hết hạn</Text>
                <View className="bg-orange-500 rounded-full px-3 py-1 flex items-center justify-center">
                    <Text className="text-white font-bold text-md">{voucherDetails.length}</Text>
                </View>
            </View>

            <View className={"flex-1 gap-3 mt-4"}>
                {voucherDetails.length > 0 ? (
                    <FlatList
                        data={voucherDetails}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => handleVoucherPress(item)}>
                                <ThemedView className="flex-row items-center bg-white rounded-xl px-4 shadow-md py-3">
                                    <Image source={{uri: item.imgUrl}} className="w-[85px] h-[85px] rounded-lg mr-4"/>
                                    <Image className={"mr-4"} source={require("@/assets/images/Voucher/voucher-slider.png")}/>
                                    <View className={"flex-1"}>
                                        <Text className="text-sm font-bold text-black">
                                            {item.title}
                                        </Text>
                                        <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                        <Text className="text-xs text-[#E47905] mt-1">
                                            Hết hạn {new Date(item.expiryDate).toLocaleDateString("vi-VN")}
                                        </Text>
                                    </View>
                                </ThemedView>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{gap: 12}}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-500">Không có voucher nào sắp hết hạn</Text>
                    </View>
                )}
            </View>
            
            <VoucherDetailModal 
                visible={modalVisible} 
                voucher={selectedVoucher}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedVoucher(null);
                }}
            />
        </View>
    );
};

const renderScene = SceneMap({
    delivery: AvailableVouchers,
    takeaway: ExpiringSoon,
});

export default function MyVoucher() {
    const navigation = useNavigation();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: "delivery", title: "Giao hàng"},
        {key: "takeaway", title: "Mang đi"},
    ]);
    
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Voucher của bạn",
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                borderBottomWidth: 10,
                borderBottomColor: '#000000',
                backgroundColor: 'white',
            },
        });
    }, [navigation]);
    
    const screenWidth = Dimensions.get('window').width;
    const numberOfTabs = 2;
    const tabWidth = screenWidth / numberOfTabs;
    
    return (
        <TabView
            navigationState={{index, routes} as NavigationState<{ key: string; title: string }>}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    indicatorStyle={{
                        backgroundColor: "orange",
                        width: 100,
                        marginLeft: (tabWidth - 100) / 2
                    }}
                    style={{backgroundColor: "white"}}
                    activeColor="orange"
                    inactiveColor="gray"
                />
            )}
        />
    );
}
