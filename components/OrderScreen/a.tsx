import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import MapView, { Callout, Marker, Polyline, Region } from 'react-native-maps';
import { Button, Image, Modal, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import apiService from "@/constants/config/axiosConfig";
import { IStore, IVoucher, Store } from "@/constants";
import { useApi } from "@/hooks/useApi";
// @ts-ignore
import polyline from '@mapbox/polyline';
import { RouteResponse } from "@/constants/interface/routeResponse.interface";
import { Ionicons } from '@expo/vector-icons';

interface OrderMapModalProps {
    visible: boolean;
    onClose: () => void;
    setSelectedStoreId?: (storeId: string) => void;
    setSelectedStoreItem?: Dispatch<SetStateAction<IStore | null>>;
    setShippingFee: Dispatch<SetStateAction<number>>;
    initialLat?: number | null;
    initialLon?: number | null;
    initialAddress?: string;
}

type Coordinates = {
    latitude: number;
    longitude: number;
};

const COLORS = {
    green: '#00FF00',
    red: '#FF0000',
    blue: '#0000FF'
};
export const OrderMapModal = ({ visible, onClose, setSelectedStoreId, setSelectedStoreItem, setShippingFee, initialLat, initialLon, initialAddress }: OrderMapModalProps) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { errorMessage, callApi: callStoreApi } = useApi<void>()
    const [stores, setStores] = useState<IStore[]>([]);
    const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
    const [coordinates, setCoordinates] = useState<any[]>([]);
    const [distance, setDistance] = useState<any>();
    const mapRef = useRef<MapView>(null);
    const [address, setAddress] = useState<string>(initialAddress || '');
    const [markerCoordinates, setMarkerCoordinates] = useState<Coordinates>({
        latitude: initialLat || 10.7769,
        longitude: initialLon || 106.7009,
    });


    const [region, setRegion] = useState<Region>({
        latitude: initialLat || 10.7769,
        longitude: initialLon || 106.7009,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    // Function to get route from HERE API
    const getRoute = async (fromLat: number, fromLong: number, toLat: number, toLong: number) => {
        try {
            const url = `https://api.locationiq.com/v1/directions/driving/${fromLong},${fromLat};${toLong},${toLat}?key=pk.b9cc0f340e91ba9cdd679d5da8a156bc&overview=full`;
            console.log("Fetching route from:", url);
            const response = await axios.get<RouteResponse>(url);
            console.log("Route response:", response.data);

            const encodedPolyline = response.data.routes[0].geometry;
            const decodedCoordinates = polyline.decode(encodedPolyline);
            // @ts-ignore
            const formattedCoordinates = decodedCoordinates.map(coordPair => {
                return { latitude: coordPair[0], longitude: coordPair[1] };
            });
            setCoordinates(formattedCoordinates);
            const distanceFromAPI = response.data.routes[0].legs[0].distance
            setDistance(distanceFromAPI);
        } catch (error) {
            console.log('Error fetching route:', error);
            setCoordinates([
                { latitude: fromLat, longitude: fromLong },
                { latitude: toLat, longitude: toLong }
            ]);
        }
    };

    useEffect(() => {
        const fetchStores = async () => {
            await callStoreApi(async () => {
                const { data } = await apiService.get<IStore[]>("/stores");
                setStores(data);
            });
        };

        fetchStores();
    }, []);

    useEffect(() => {
        setAddress(initialAddress || '');
        if (visible) {
            fetchCoordinates(address.trim());
        }

    }, [visible, initialAddress, region.latitudeDelta, region.longitudeDelta]);

    const fetchCoordinates = async (inputAddress: string): Promise<void> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputAddress)}&format=json&limit=1&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'MyReactNativeApp/1.0 (phanchauhoang2004@example.com)',
                    },
                }
            );
            const data: any[] = await response.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                const newCoordinates: Coordinates = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
                setMarkerCoordinates(newCoordinates);
                console.log(markerCoordinates);
                setAddress(data[0].display_name);

                mapRef.current?.animateToRegion(
                    {
                        latitude: newCoordinates.latitude,
                        longitude: newCoordinates.longitude,
                        latitudeDelta: region.latitudeDelta,
                        longitudeDelta: region.longitudeDelta,
                    },
                    1000
                );
            } else {
                setAddress('Không tìm thấy địa chỉ');
                console.log("ko tim thay")
            }
        } catch (error) {
            console.error('Lỗi khi gọi API Nominatim:', error);
            setAddress('Lỗi khi lấy tọa độ');
        }
    };
    useEffect(() => {
        if (selectedStore) {
            getRoute(
                markerCoordinates.latitude,
                markerCoordinates.longitude,
                selectedStore.latitude,
                selectedStore.longitude
            );
        } else {
            setCoordinates([]);
        }
    }, [selectedStore]);

    useEffect(() => {
        const latitude =
            initialLat != null
                ? initialLat
                : location?.coords.latitude ?? 10.7769;
        const longitude =
            initialLon != null
                ? initialLon
                : location?.coords.longitude ?? 106.7009;

        if (visible) {
            mapRef.current?.animateToRegion(
                {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                },
                1000
            );
        }
    }, [visible, initialLat, initialLon, region.latitudeDelta, region.longitudeDelta]);


    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.locateBtn}
                onPress={() => {
                    if (mapRef.current) {
                        mapRef.current?.animateCamera(
                            { center: markerCoordinates },
                            { duration: 800 }
                        );
                    }
                }}
                activeOpacity={0.7}
            >
                <Ionicons name="locate" size={28} color="#f59e0b" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Chọn cửa hàng</Text>
            </View>
            <View className="flex-1 justify-start items-center">
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFillObject}
                    className="w-full h-4/5"
                    initialRegion={{
                        latitude: initialLat || 10.7769,
                        longitude: initialLon || 106.7009,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={markerCoordinates}
                        title="You are here"
                    />

                    {stores.map((store) => (
                        <Marker
                            key={store.id}
                            coordinate={{
                                latitude: store.latitude,
                                longitude: store.longitude,
                            }}
                            onPress={() => setSelectedStore(store)}
                            title={store.name}
                            pinColor="blue"
                        >
                        </Marker>
                    ))}

                    {coordinates.length > 0 && (
                        <Polyline
                            coordinates={coordinates}
                            strokeColor={COLORS.blue}
                            strokeWidth={5}
                        />
                    )}
                </MapView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.confirmBtn,
                            selectedStore == null && { backgroundColor: "#d1d5db" } // màu xám khi disable
                        ]}
                        onPress={() => {
                            setSelectedStoreId && selectedStore && setSelectedStoreId(selectedStore.id || "")
                            if (setSelectedStoreItem) {
                                setSelectedStoreItem(selectedStore);
                                const shippingFee = Math.ceil(distance / 1000) * 5000;
                                setShippingFee(shippingFee);
                            }
                            onClose()
                        }}
                        disabled={selectedStore == null}
                    >
                        <Text style={styles.confirmText}>Xác nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelText}>Hủy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    confirmText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelText: {
        color: "#374151",
        fontWeight: "bold",
        fontSize: 16,
    },
    locationText: {
        fontSize: 12,
        marginBottom: 5,
    },
    confirmBtn: {
        flex: 1,
        backgroundColor: "#f59e0b",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginRight: 8,
        elevation: 2,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: "#e5e7eb",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginLeft: 8,
        elevation: 2,
    },
    locateBtn: {
        position: 'absolute',
        top: 70,
        right: 20,
        zIndex: 10,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    headerContainer: {
        position: 'absolute',
        top: 12,
        left: 20,
        right: 20,
        zIndex: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 6,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f59e0b',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0,0,0,0.04)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});