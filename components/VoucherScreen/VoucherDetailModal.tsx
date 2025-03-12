import React from "react";
import { View, Text, Modal, Image, TouchableOpacity, ScrollView } from "react-native";
import { X } from "lucide-react-native"; // Import icon đóng

const VoucherDetailModal = ({ visible, onClose }) => {
    const imgUri = "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Voucher%2FGi%E1%BA%A3m%2030%25%20%2B%20Freeship%20%C4%90%C6%A1n%20T%E1%BB%AB%203%20Ly.jpg?alt=media&token=72f401b9-4334-48eb-aea8-cdf05a815c77";

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
                        <Text className="mt-5 text-center text-3xl font-bold">Miễn Phí Giao Hàng</Text>

                        {/* Hình ảnh */}
                        <View className="flex items-center mt-6">
                            <Image source={{ uri: imgUri }} className="w-[200px] h-[200px] rounded-lg" />
                        </View>

                        {/* Nút đặt hàng */}
                        <TouchableOpacity className="bg-black py-4 mt-6 rounded-full mx-28">
                            <Text className="text-white text-center font-semibold text-lg">Bắt đầu đặt hàng</Text>
                        </TouchableOpacity>

                        {/* Ngày hết hạn */}
                        <View className="mt-6 border-t border-gray-300 pt-3 flex-row justify-between px-4">
                            <Text className="text-gray-500 text-base">Ngày hết hạn:</Text>
                            <Text className="text-orange-500 font-semibold text-base">30-06-2024</Text>
                        </View>

                        {/* Điều kiện áp dụng */}
                        <View className="mt-4 px-4 border-t border-gray-300">
                            <Text className="mt-3 text-gray-700 text-base leading-6">
                                - Miễn phí vận chuyển{"\n"}
                                - Áp dụng dịch vụ Giao hàng (Delivery) khi đặt hàng qua App The Hachiko Coffee.{"\n"}
                                - Áp dụng cho đơn hàng từ 18.000đ, có 1 sản phẩm nước bất kỳ.{"\n"}
                                - Không áp dụng song song các chương trình khác.{"\n"}
                                - Nếu sản phẩm thuộc nhiều chương trình, hệ thống sẽ ưu tiên áp dụng voucher.{"\n"}
                                - Chương trình có thể kết thúc sớm nếu hết số lượng ưu đãi.
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default VoucherDetailModal;
