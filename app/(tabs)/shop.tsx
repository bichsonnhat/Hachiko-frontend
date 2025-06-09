import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator
} from "react-native";
import StoreItem from "@/components/ShopScreen/StoreItem";
import ShopHeader from "@/components/ShopScreen/ShopHeader";
import {IStore, Store} from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import {useApi} from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";

function calculateDistance(latitude1: number, longitude1: number, latitude2: number, longitude2: number) {
    const toRadian = (n: number) => (n * Math.PI) / 180

    let lat2 = latitude2
    let lon2 = longitude2
    let lat1 = latitude1
    let lon1 = longitude1

    let R = 6371  // km
    let x1 = lat2 - lat1
    let dLat = toRadian(x1)
    let x2 = lon2 - lon1
    let dLon = toRadian(x2)
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c
    return d
}

type SectionItem = {
    type: "nearby" | "other";
    title: string;
    data: IStore[];
};

export default function ShopScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const {errorMessage, callApi: callStoreApi} = useApi<void>()
    const [stores, setStores] = useState<IStore[]>([]);
    const [loading, setLoading] = useState(false);
    const [sectionData, setSectionData] = useState<SectionItem[]>([]);

    const processStoresWithDistance = (storesData: IStore[], userLocation: Location.LocationObject | null) => {
        if (!userLocation) {
            return storesData;
        }

        const storesWithDistance = storesData.map(store => {
            const distance = calculateDistance(
                userLocation.coords.latitude,
                userLocation.coords.longitude,
                store.latitude,
                store.longitude
            );

            return {
                ...store,
                distance: Number(distance.toFixed(2))
            };
        });

        return storesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    };

    const categorizeStores = (sortedStores: IStore[]) => {
        const NEARBY_THRESHOLD = 5;

        const nearbyStores = sortedStores.filter(store => (store.distance || 0) <= NEARBY_THRESHOLD);
        const otherStores = sortedStores.filter(store => (store.distance || 0) > NEARBY_THRESHOLD);

        return [
            {
                type: "nearby" as const,
                title: "Cửa hàng gần bạn",
                data: nearbyStores
            },
            {
                type: "other" as const,
                title: "Các cửa hàng khác",
                data: otherStores
            }
        ].filter(section => section.data.length > 0); // Remove empty sections
    };

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            await callStoreApi(async () => {
                const {data} = await apiService.get<IStore[]>("/stores");
                setStores(data);
            });
            setLoading(false);
        };

        fetchStores();
    }, []);

    useEffect(() => {
        if (stores.length > 0) {
            const processedStores = processStoresWithDistance(stores, location);
            const categorizedStores = categorizeStores(processedStores);
            setSectionData(categorizedStores);
        }
    }, [stores, location]);

    useEffect(() => {
        async function getCurrentLocation() {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            try {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            } catch (error) {
                console.log('Error getting location:', error);
            }
        }
        getCurrentLocation();
    }, []);

    const SectionListItem = React.memo(({ item }: { item: SectionItem }) => {
        return (
            <View className="flex-col pb-4 border-b border-gray-100">
                <Text className="text-lg font-bold px-4 py-2">{item.title}</Text>
                <View>
                    {item.data.map((store) => (
                        <View key={store.id} className="mb-3 px-4">
                            <StoreItem store={store} />
                        </View>
                    ))}
                </View>
            </View>
        );
    });

    const renderItem = ({ item }: { item: SectionItem }) => {
        return <SectionListItem item={item} />;
    };

    const keyExtractor = (item: SectionItem, index: number) => {
        return `section-${item.type}-${index}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
            <ShopHeader />

            <View className="flex-1 bg-white">
                {loading ? (
                    <View className="flex-1 items-center justify-center h-full">
                        <ActivityIndicator size="large" color="#FF8C00" />
                    </View>
                ) : sectionData.length === 0 ? (
                    <View className="flex-1 items-center justify-center h-full">
                        <Text className="text-lg text-gray-500">Không tìm thấy cửa hàng</Text>
                    </View>
                ) : (
                    <FlatList
                        data={sectionData}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        initialNumToRender={3}
                        maxToRenderPerBatch={5}
                        windowSize={5}
                        contentContainerStyle={{ paddingTop: 0, paddingBottom: 80 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}