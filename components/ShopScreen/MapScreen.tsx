import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Modal, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import apiService from "@/constants/config/axiosConfig";
import { IStore } from "@/constants";
import { useApi } from "@/hooks/useApi";
// @ts-ignore
import polyline from '@mapbox/polyline';

interface ShopModalProps {
    visible: boolean;
    onClose: () => void;
}

const COLORS = {
    green: '#00FF00',
    red: '#FF0000',
    blue: '#0000FF'
};

export const MapScreen = ({ visible, onClose }: ShopModalProps) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const { callApi: callStoreApi } = useApi<void>()
    const [stores, setStores] = useState<IStore[]>([]);
    const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
    const [coordinates, setCoordinates] = useState<any[]>([]);
    const [distance, setDistance] = useState<number | null>(null);
    const [region, setRegion] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);

    // Thêm ref cho MapView để animate camera
    const mapRef = useRef<MapView>(null);

    // Function to get route and distance
    const getRoute = async (fromLat: number, fromLong: number, toLat: number, toLong: number) => {
        try {
            const url = `https://api.locationiq.com/v1/directions/driving/${fromLong},${fromLat};${toLong},${toLat}?key=pk.b9cc0f340e91ba9cdd679d5da8a156bc&overview=full`;
            const response = await axios.get(url);
            const encodedPolyline = response.data.routes[0].geometry;
            const decodedCoordinates = polyline.decode(encodedPolyline);
            const formattedCoordinates = decodedCoordinates.map((coordPair: [number, number]) => ({
                latitude: coordPair[0],
                longitude: coordPair[1],
            }));
            setCoordinates(formattedCoordinates);
            const distanceFromAPI = response.data.routes[0].legs[0].distance;
            setDistance(distanceFromAPI);
        } catch (error) {
            setCoordinates([
                { latitude: fromLat, longitude: fromLong },
                { latitude: toLat, longitude: toLong }
            ]);
            setDistance(null);
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
        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (location && selectedStore) {
            getRoute(
                location.coords.latitude,
                location.coords.longitude,
                selectedStore.latitude,
                selectedStore.longitude
            );
            // Animate camera đến vị trí cửa hàng khi chọn
            mapRef.current?.animateToRegion(
                {
                    latitude: selectedStore.latitude,
                    longitude: selectedStore.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                800
            );
        } else {
            setCoordinates([]);
            setDistance(null);
        }
    }, [location, selectedStore]);

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-start items-center">
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFillObject}
                    className="w-full h-4/5"
                    region={region || {
                        latitude: 10.7769,
                        longitude: 106.7009,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {location && (
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            title="You are here"
                            pinColor="blue"
                        />
                    )}

                    {stores.map((store) => (
                        <Marker
                            key={store.id}
                            coordinate={{
                                latitude: store.latitude,
                                longitude: store.longitude,
                            }}
                            onPress={() => setSelectedStore(store)}
                            title={store.name}
                        />
                    ))}

                    {coordinates.length > 0 && (
                        <Polyline
                            coordinates={coordinates}
                            strokeColor={COLORS.blue}
                            strokeWidth={5}
                        />
                    )}
                </MapView>

                {/* Info container giống OrderMapModal */}
                {selectedStore && (
                    <View style={styles.infoContainer}>
                        <Text style={styles.text}>
                            Cửa hàng: <Text style={{ fontWeight: 'bold', color: '#f59e0b' }}>{selectedStore.name}</Text>
                        </Text>
                        <Text style={styles.text}>
                            Địa chỉ: {selectedStore.address}
                        </Text>
                        {distance !== null && (
                            <Text style={styles.text}>
                                Khoảng cách: {(distance / 1000).toFixed(2)} km
                            </Text>
                        )}
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelText}>Tắt map</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 12,
        borderRadius: 10,
        alignItems: 'flex-start',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    text: {
        fontSize: 15,
        color: '#374151',
        marginBottom: 2,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#f59e0b',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 8,
        elevation: 2,
    },
    cancelText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});