import React from "react";
import { View, Text, Modal, Image, TouchableOpacity, ScrollView } from "react-native";
import { X } from "lucide-react-native"; // Import icon đóng
import { useRouter } from "expo-router";

// Updated Voucher interface to match the API response
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

interface VoucherDetailModalProps {
    visible: boolean;
    onClose: () => void;
    voucher: Voucher | null;
}

const VoucherDetailModal = ({ visible, onClose, voucher }: VoucherDetailModalProps) => {
    const router = useRouter();

    // Handle navigation to order tab and close modal
    const handleOrderButtonPress = () => {
        onClose(); // Close the modal first
        
        // Navigate to order tab with the voucher ID as a parameter
        if (voucher && voucher.id) {
            // Navigate with voucher ID as a parameter
            router.push({
                pathname: "/(tabs)/order",
                params: { voucherId: voucher.id }
            });
        } else {
            router.push("/(tabs)/order");
        }
    };

    // If no voucher data, don't render the modal content
    if (!voucher) {
        return (
            <Modal animationType="slide" transparent visible={visible}>
                <View className="flex-1 bg-gray-100 p-5">
                    <View className="flex-1 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                        <TouchableOpacity onPress={onClose} className="absolute right-4 top-4 z-10">
                            <X size={32} color="black" />
                        </TouchableOpacity>
                        <Text className="text-gray-500">No voucher data available</Text>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal animationType="slide" transparent visible={visible}>
            {/* Lớp ngoài có nền gray-100 */}
            <View className="flex-1 bg-gray-100 p-5">
                {/* Lớp trong có nền trắng */}
                <View className="flex-1 bg-white rounded-2xl shadow-lg">
                    {/* Nút đóng */}
                    <TouchableOpacity onPress={onClose} className="absolute right-4 top-4 z-10">
                        <X size={32} color="black" />
                    </TouchableOpacity>

                    {/* Nội dung chính */}
                    <ScrollView className="flex-1 p-4">
                        {/* Tiêu đề */}
                        <Text className="text-center text-gray-500 font-semibold mt-10">The Hachiko Coffee</Text>
                        <Text className="mt-5 text-center text-3xl font-bold">{voucher.title}</Text>

                        {/* Hình ảnh */}
                        <View className="flex items-center mt-6">
                            <Image 
                                source={{ uri: voucher.imgUrl }} 
                                className="w-[200px] h-[200px] rounded-lg" 
                            />
                        </View>

                        {/* Chi tiết giảm giá */}
                        <View className="mt-4 mx-8">
                            {voucher.discountPercent > 0 && (
                                <Text className="text-center text-lg font-bold text-orange-500">
                                    Giảm {voucher.discountPercent}%
                                </Text>
                            )}
                            {voucher.discountPrice > 0 && (
                                <Text className="text-center text-lg font-bold text-orange-500">
                                    Giảm {voucher.discountPrice.toLocaleString('vi-VN')}đ
                                </Text>
                            )}
                            {voucher.isFreeShip && (
                                <Text className="text-center text-lg font-bold text-orange-500">
                                    Miễn phí giao hàng
                                </Text>
                            )}
                        </View>

                        {/* Nút đặt hàng */}
                        <TouchableOpacity 
                            className="bg-black py-4 mt-6 rounded-full mx-28"
                            onPress={handleOrderButtonPress}
                        >
                            <Text className="text-white text-center font-semibold text-lg">Bắt đầu đặt hàng</Text>
                        </TouchableOpacity>

                        {/* Ngày hết hạn */}
                        <View className="mt-6 border-t border-gray-300 pt-3 flex-row justify-between px-4">
                            <Text className="text-gray-500 text-base">Ngày hết hạn:</Text>
                            <Text className="text-orange-500 font-semibold text-base">
                                {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
                            </Text>
                        </View>

                        {/* Điều kiện áp dụng */}
                        <View className="mt-4 px-4 border-t border-gray-300">
                            <Text className="mt-3 mb-2 font-bold text-base">Điều kiện áp dụng:</Text>
                            <Text className="mt-1 text-gray-700 text-base leading-6">
                                {voucher.description}
                            </Text>
                            {voucher.minOrderPrice > 0 && (
                                <Text className="mt-2 text-gray-700 text-base">
                                    - Đơn hàng tối thiểu: {voucher.minOrderPrice.toLocaleString('vi-VN')}đ
                                </Text>
                            )}
                            {voucher.minOrderItem > 0 && (
                                <Text className="mt-2 text-gray-700 text-base">
                                    - Số lượng món tối thiểu: {voucher.minOrderItem}
                                </Text>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default VoucherDetailModal;
