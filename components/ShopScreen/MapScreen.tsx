import React, {useEffect, useState} from 'react';
import MapView, {Callout, Marker, Polyline} from 'react-native-maps';
import {Button, Image, Modal, StyleSheet, View, Text} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import apiService from "@/constants/config/axiosConfig";
import {IStore, IVoucher, Store} from "@/constants";
import {useApi} from "@/hooks/useApi";
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

export const MapScreen = ({visible, onClose}: ShopModalProps) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { errorMessage, callApi: callStoreApi } = useApi<void>()
    const [stores, setStores] = useState<IStore[]>([]);
    const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
    const [coordinates, setCoordinates] = useState<any[]>([]);

    // Function to get route from HERE API
    const getRoute = async (fromLat: number, fromLong: number, toLat: number, toLong: number) => {
        try {
            const url = `https://api.locationiq.com/v1/directions/driving/${fromLong},${fromLat};${toLong},${toLat}?key=pk.b9cc0f340e91ba9cdd679d5da8a156bc&overview=full`;
            const response = await axios.get(url);
            const encodedPolyline = response.data.routes[0].geometry;
            const decodedCoordinates = polyline.decode(encodedPolyline);
            // @ts-ignore
            const formattedCoordinates = decodedCoordinates.map(coordPair => {
                return { latitude: coordPair[0], longitude: coordPair[1] };
            });
            setCoordinates(formattedCoordinates);
        } catch (error) {
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
        async function getCurrentLocation() {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
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
        } else {
            setCoordinates([]);
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
                    style={StyleSheet.absoluteFillObject}
                    className="w-full h-4/5"
                    initialRegion={{
                        latitude: location?.coords.latitude || 37.78825,
                        longitude: location?.coords.longitude || -122.4324,
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
                            onCalloutPress={() => console.log(selectedStore?.id)}
                        >
                            <Callout>

                                <View style={{ alignItems: 'center', width: 150, height: 380,
                                }}>
                                    <Image
                                        source={{ uri: store.imageURL }}
                                        style={{ width: 100, height: 60, borderRadius: 8, marginBottom: 4 }}
                                        resizeMode="cover"
                                    />
                                    <Text style={{ fontWeight: 'bold' }}>{store.name}</Text>
                                </View>
                            </Callout>
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

                    <Button title="Tắt map" onPress={onClose} />
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
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    locationText: {
        fontSize: 12,
        marginBottom: 5,
    },
});