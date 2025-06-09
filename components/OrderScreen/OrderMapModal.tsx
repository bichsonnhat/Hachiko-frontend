import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import apiService from "@/constants/config/axiosConfig";
// @ts-ignore

import polyline from '@mapbox/polyline';
import { Ionicons } from '@expo/vector-icons';
import { IStore } from '@/constants';

// Định nghĩa interface cho route response
interface RouteResponse {
    routes: {
        geometry: string;
        legs: { distance: number }[];
    }[];
}

// Định nghĩa interface cho props
interface CombinedMapModalProps {
    visible: boolean;
    initialAddress?: string;
    initialLat?: number | null;
    initialLon?: number | null;
    onConfirm: (data: { address: string; lat: number; lon: number }) => void;
    onClose: () => void;
    setSelectedStoreId?: (storeId: string) => void;
    setShippingFee: Dispatch<SetStateAction<number>>;
}

// Định nghĩa type cho tọa độ
type Coordinates = {
    latitude: number;
    longitude: number;
};

// Định nghĩa type cho location từ expo-location
type LocationObject = {
    coords: {
        latitude: number;
        longitude: number;
    };
};

const COLORS = {
    green: '#00FF00',
    red: '#FF0000',
    blue: '#0000FF',
};

const CombinedMapModal: React.FC<CombinedMapModalProps> = ({
    visible,
    initialAddress,
    initialLat,
    initialLon,
    onConfirm,
    onClose,
    setSelectedStoreId,
    setShippingFee,
}) => {
    // State lưu tọa độ Marker
    const [markerCoordinates, setMarkerCoordinates] = useState<Coordinates>({
        latitude: initialLat || 10.7769, // Mặc định: TP.HCM
        longitude: initialLon || 106.7009,
    });
    // State lưu địa chỉ
    const [address, setAddress] = useState<string>(initialAddress || '');
    // State lưu vùng bản đồ
    const [region] = useState<Region>({
        latitude: initialLat || 10.7769,
        longitude: initialLon || 106.7009,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    // State lưu vị trí hiện tại
    const [location, setLocation] = useState<LocationObject | null>(null);
    // State kiểm soát hiển thị Marker
    const [showMarker, setShowMarker] = useState<boolean>(false);
    // State cho danh sách cửa hàng
    const [stores, setStores] = useState<IStore[]>([]);
    // State cho cửa hàng được chọn
    const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
    // State cho đường đi
    const [coordinates, setCoordinates] = useState<Coordinates[]>([]);
    // State cho khoảng cách
    const [distance, setDistance] = useState<any>();
    const mapRef = useRef<MapView>(null);

    // Lấy vị trí hiện tại khi component mount
    useEffect(() => {
        async function getCurrentLocation() {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.warn('Quyền truy cập vị trí bị từ chối');
                    setShowMarker(true); // Hiển thị Marker với tọa độ mặc định
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                setShowMarker(true); // Hiển thị Marker sau khi lấy vị trí
            } catch (error) {
                console.error('Lỗi khi lấy vị trí hiện tại:', error);
                setShowMarker(true); // Hiển thị Marker với tọa độ mặc định nếu lỗi
            }
        }
        if (initialLat == null || initialLon == null) {
            getCurrentLocation();
        } else {
            setShowMarker(true); // Hiển thị Marker nếu có initialLat/initialLon
        }
    }, [initialLat, initialLon]);

    // Lấy danh sách cửa hàng từ API
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const { data } = await apiService.get<IStore[]>('/stores');
                setStores(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách cửa hàng:', error);
            }
        };
        fetchStores();
    }, []);

    // Cập nhật state và animate camera khi modal mở hoặc props thay đổi
    useEffect(() => {
        setAddress(initialAddress || '');

        // Ưu tiên initialLat/initialLon, nếu không có thì lấy từ location, nếu không có nữa thì mặc định TP.HCM
        const latitude =
            initialLat != null ? initialLat : location?.coords.latitude ?? 10.7769;
        const longitude =
            initialLon != null ? initialLon : location?.coords.longitude ?? 106.7009;

        const newCoordinates: Coordinates = { latitude, longitude };
        setMarkerCoordinates(newCoordinates);

        // Animate camera khi modal mở để Marker ở giữa bản đồ
        if (visible) {
            mapRef.current?.animateToRegion(
                {
                    latitude,
                    longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                },
                1000
            );
            setShowMarker(true); // Hiển thị Marker khi tọa độ đã được xác định
        }
    }, [visible, initialAddress, initialLat, initialLon, location, region.latitudeDelta, region.longitudeDelta]);

    // Lấy đường đi khi chọn cửa hàng
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
            setDistance(null);
        }
    }, [selectedStore, markerCoordinates]);

    // Hàm gọi API Nominatim để lấy tọa độ từ địa chỉ (forward geocoding)
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
            }
        } catch (error) {
            console.error('Lỗi khi gọi API Nominatim:', error);
            setAddress('Lỗi khi lấy tọa độ');
        }
    };

    // Hàm gọi API Nominatim để lấy địa chỉ từ tọa độ (reverse geocoding)
    const fetchAddress = async (latitude: number, longitude: number): Promise<void> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'MyReactNativeApp/1.0 (phanchauhoang2004@example.com)',
                    },
                }
            );
            const data: any = await response.json();
            setAddress(data.display_name || 'Không tìm thấy địa chỉ');
        } catch (error) {
            console.error('Lỗi khi gọi API Nominatim:', error);
            setAddress('Lỗi khi lấy địa chỉ');
        }
    };

    // Hàm lấy đường đi từ LocationIQ API
    const getRoute = async (fromLat: number, fromLong: number, toLat: number, toLong: number) => {
        try {
            const url = `https://api.locationiq.com/v1/directions/driving/${fromLong},${fromLat};${toLong},${toLat}?key=pk.b9cc0f340e91ba9cdd679d5da8a156bc&overview=full`;
            const response = await axios.get<RouteResponse>(url);
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
            console.error('Lỗi khi lấy đường đi:', error);
            setCoordinates([
                { latitude: fromLat, longitude: fromLong },
                { latitude: toLat, longitude: toLong },
            ]);
        }
    };

    // Xử lý khi Marker được thả
    const handleMarkerDragEnd = (event: { nativeEvent: { coordinate: Coordinates } }) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setMarkerCoordinates({ latitude, longitude });
        mapRef.current?.animateToRegion(
            {
                latitude,
                longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
            },
            1000
        );
        fetchAddress(latitude, longitude);
    };

    // Xử lý khi nhấn nút tìm kiếm
    const handleSearch = () => {
        if (address.trim()) {
            fetchCoordinates(address);
        }
    };

    // Xử lý khi nhấn nút xác nhận
    const handleConfirm = () => {
        onConfirm({
            address,
            lat: markerCoordinates.latitude,
            lon: markerCoordinates.longitude,
        });
        setSelectedStoreId && selectedStore && setSelectedStoreId(selectedStore.id || "")
        const shippingFee = Math.ceil(distance / 1000) * 5000;
        console.log(shippingFee);
        setShippingFee(shippingFee);
        onClose()
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Chọn vị trí và cửa hàng</Text>
                </View>

                {/* Ô nhập địa chỉ và nút tìm kiếm */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { height: 44, textAlignVertical: 'center' }]}
                        placeholder="Nhập địa chỉ (VD: 144 Đ. 154, Tân Phú, Thủ Đức, TP.HCM)"
                        value={address}
                        onChangeText={setAddress}
                        multiline={false}
                        numberOfLines={1}
                        maxLength={120}
                    />
                    <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                        <Text style={styles.confirmText}>Tìm</Text>
                    </TouchableOpacity>
                </View>

                {/* Nút Locate */}
                <TouchableOpacity
                    style={styles.locateBtn}
                    onPress={() => {
                        mapRef.current?.animateToRegion(
                            {
                                latitude: markerCoordinates.latitude,
                                longitude: markerCoordinates.longitude,
                                latitudeDelta: region.latitudeDelta,
                                longitudeDelta: region.longitudeDelta,
                            },
                            800
                        );
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="locate" size={28} color="#f59e0b" />
                </TouchableOpacity>

                {/* Bản đồ */}
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={region}
                >
                    {showMarker && (
                        <Marker
                            coordinate={markerCoordinates}
                            draggable
                            onDragEnd={handleMarkerDragEnd}
                            title="Vị trí của bạn"
                            description="Kéo và thả để chọn vị trí mới"
                            pinColor="red"
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
                            pinColor="blue"
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

                {/* Hiển thị thông tin */}
                <View style={styles.infoContainer}>
                    <Text style={styles.text}>Latitude: {markerCoordinates.latitude}</Text>
                    <Text style={styles.text}>Longitude: {markerCoordinates.longitude}</Text>
                    {selectedStore && (
                        <Text style={styles.text}>Cửa hàng: {selectedStore.name}</Text>
                    )}
                    {distance && (
                        <Text style={styles.text}>Khoảng cách: {(distance / 1000).toFixed(2)} km</Text>
                    )}
                </View>

                {/* Nút Xác nhận và Hủy */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.confirmBtn,
                            (!showMarker || !selectedStore) && { backgroundColor: '#d1d5db' },
                        ]}
                        onPress={handleConfirm}
                        disabled={!showMarker || !selectedStore}
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        shadowOpacity: 0.1,
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
    inputContainer: {
        position: 'absolute',
        top: 70,
        left: 10,
        right: 10,
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 4,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    input: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 5,
        borderRadius: 6,
        marginRight: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    searchBtn: {
        backgroundColor: '#f59e0b',
        borderRadius: 6,
        overflow: 'hidden',
        padding: 5,
    },
    map: {
        flex: 1,
    },
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
    confirmBtn: {
        flex: 1,
        backgroundColor: '#f59e0b',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 8,
        elevation: 2,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#e5e7eb',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 8,
        elevation: 2,
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelText: {
        color: '#374151',
        fontWeight: 'bold',
        fontSize: 16,
    },
    locateBtn: {
        position: 'absolute',
        top: 130,
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
});

export default CombinedMapModal;