import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region, Camera } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Định nghĩa interface cho props
interface MapModalProps {
    visible: boolean;
    initialAddress?: string;
    initialLat?: number | null;
    initialLon?: number | null;
    onConfirm: (data: { address: string; lat: number; lon: number }) => void;
    onCancel: () => void;
}

// Định nghĩa type cho tọa độ
type Coordinates = {
    latitude: number;
    longitude: number;
};

const MapModal: React.FC<MapModalProps> = ({
    visible,
    initialAddress,
    initialLat,
    initialLon,
    onConfirm,
    onCancel,
}) => {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [showMarker, setShowMarker] = useState<boolean>(false);
    // State lưu tọa độ Marker
    const [markerCoordinates, setMarkerCoordinates] = useState<Coordinates>({
        latitude: initialLat || 10.7769, // Mặc định: TP.HCM
        longitude: initialLon || 106.7009,
    });
    // State lưu địa chỉ
    const [address, setAddress] = useState<string>(initialAddress || '');
    // State lưu vùng bản đồ
    const [region, setRegion] = useState<Region>({
        latitude: initialLat || 10.7769,
        longitude: initialLon || 106.7009,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        async function getCurrentLocation() {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.warn('Quyền truy cập vị trí bị từ chối');
                    setShowMarker(true); // Vẫn hiển thị Marker với tọa độ mặc định
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
        getCurrentLocation();
    }, []);

    // Cập nhật state và animate camera khi modal mở hoặc props thay đổi
    useEffect(() => {
        // Cập nhật địa chỉ
        setAddress(initialAddress || '');

        // Ưu tiên initialLat/initialLon, nếu không có thì lấy từ location, nếu không có nữa thì mặc định TP.HCM
        const latitude =
            initialLat != null
                ? initialLat
                : location?.coords.latitude ?? 10.7769;
        const longitude =
            initialLon != null
                ? initialLon
                : location?.coords.longitude ?? 106.7009;

        const newCoordinates: Coordinates = { latitude, longitude };
        setMarkerCoordinates(newCoordinates);

        // Animate camera khi modal mở
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

                mapRef.current?.animateCamera(
                    {
                        center: newCoordinates,
                    },
                    { duration: 1000 }
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

    // Xử lý khi Marker được thả
    const handleMarkerDragEnd = (event: { nativeEvent: { coordinate: Coordinates } }) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setMarkerCoordinates({ latitude, longitude });
        // Di chuyển bản đồ mà không thay đổi zoom
        mapRef.current?.animateCamera(
            {
                center: { latitude, longitude },
            },
            { duration: 1000 }
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
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
            <View style={styles.container}>
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

                <TouchableOpacity
                    style={styles.locateBtn}
                    onPress={() => {
                        mapRef.current?.animateCamera(
                            { center: markerCoordinates },
                            { duration: 800 }
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
                    <Marker
                        coordinate={markerCoordinates}
                        draggable
                        onDragEnd={handleMarkerDragEnd}
                        title="Vị trí của bạn"
                        description="Kéo và thả để chọn vị trí mới"
                    />
                </MapView>

                {/* Hiển thị thông tin */}
                <View style={styles.infoContainer}>
                    <Text style={styles.text}>Latitude: {markerCoordinates.latitude}</Text>
                    <Text style={styles.text}>Longitude: {markerCoordinates.longitude}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                        <Text style={styles.confirmText}>Xác nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
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
        backgroundColor: "#fff",
    },
    inputContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
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
        borderColor: "#e5e7eb",
    },
    searchBtn: {
        backgroundColor: "#f59e0b",
        borderRadius: 6,
        overflow: "hidden",
        padding: 5
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
        color: "#374151",
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
});

export default MapModal;