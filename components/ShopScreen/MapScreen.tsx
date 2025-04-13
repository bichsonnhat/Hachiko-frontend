import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Button, Modal, StyleSheet, View} from 'react-native';
import * as Location from 'expo-location';

interface ShopModalProps {
    visible: boolean;
    onClose: () => void;
}

export const MapScreen = ({visible, onClose}: ShopModalProps) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
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
                        latitude: location?.coords.latitude || 37.78825, // Use the current latitude or default to 37.78825
                        longitude: location?.coords.longitude || -122.4324, // Use the current longitude or default to -122.4324
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
                        />
                    )}
                </MapView>

                <Button title={text} onPress={onClose} />
            </View>
        </Modal>
    );
}
