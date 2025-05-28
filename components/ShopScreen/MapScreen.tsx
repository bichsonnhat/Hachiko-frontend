import React, {useEffect, useState} from 'react';
import MapView, {Callout, Marker, Polyline} from 'react-native-maps';
import {Button, Image, Modal, StyleSheet, View, Text} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import apiService from "@/constants/config/axiosConfig";
import {ItemType} from "react-native-dropdown-picker";
import {IStore, IVoucher, Store} from "@/constants";
import {useApi} from "@/hooks/useApi";
import {HereRoutingResponse} from "@/constants/interface/here-routing-response.interface";

interface ShopModalProps {
    visible: boolean;
    onClose: () => void;
}

const HERE_APP_ID = "OB7L6jOZrcE10QGpbzMM";
const HERE_APP_CODE = "fkQia5FxXS2fTgEq-96IWfkHLWoiMKzRglwUhml0x1c";

// Colors constant
const COLORS = {
    green: '#00FF00',
    red: '#FF0000',
    blue: '#0000FF'
};
const decodePolyline = (t: any) => {
    let points: any = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
        let b, shift = 0, result = 0;
        do {
            b = t.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = t.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;};
export const MapScreen = ({visible, onClose}: ShopModalProps) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { errorMessage, callApi: callStoreApi } = useApi<void>()
    const [stores, setStores] = useState<IStore[]>([]);
    const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
    const [coordinates, setCoordinates] = useState<any[]>([]);

    // Decode polyline function
    const decodePolyline = (t: any) => {
        let points: any = [];
        let index = 0, len = t.length;
        let lat = 0, lng = 0;

        while (index < len) {
            let b, shift = 0, result = 0;
            do {
                b = t.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = t.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
        return points;
    };

    // Function to get route from HERE API
    const getRoute = async (fromLat: number, fromLong: number, toLat: number, toLong: number) => {
        try {

            const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${fromLat+","+fromLong}&destination=${toLat+","+toLong}&return=summary,polyline&apikey=${HERE_APP_CODE}`;
            console.log('HERE API URL:', url);

            const response = await axios.get<HereRoutingResponse>(url);
            console.log("decode",decodePolyline(response.data.routes[0].sections[0].polyline))
            setCoordinates(decodePolyline(response.data.routes[0].sections[0].polyline))
            console.log('HERE API response:', response.data);



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
                console.log("Fetched stores:", data);
                setStores(data);
            });
        };

        fetchStores();
    }, []);

    useEffect(() => {
        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log(location);
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    // Effect to get route when both location and selected store are available
    useEffect(() => {
        if (location && selectedStore) {
            getRoute(
                location.coords.latitude,
                location.coords.longitude,
                selectedStore.latitude,
                selectedStore.longitude
            );
        } else {
            // Clear coordinates if no store is selected
            setCoordinates([]);
        }
    }, [location, selectedStore]);

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = `Location: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
    }

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
                    {/* Marker cho vị trí hiện tại của người dùng */}
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

                    {/* Marker cho các store */}
                    {stores.map((store) => (
                        <Marker
                            key={store.id}
                            coordinate={{
                                latitude: store.latitude,
                                longitude: store.longitude,
                            }}
                            onPress={() => setSelectedStore(store)}
                        >
                            <Callout>
                                <View style={{ alignItems: 'center', width: 150 }}>
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

                    {/* Polyline with route from HERE API */}
                    {coordinates.length > 0 && (
                        <Polyline
                            coordinates={coordinates}
                            strokeColor={COLORS.green}
                            strokeWidth={5}
                        />
                    )}
                </MapView>

                <Button title={text} onPress={onClose} />
            </View>
        </Modal>
    );
}