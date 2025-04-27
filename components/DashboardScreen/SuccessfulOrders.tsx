import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { IOrder, OrderRecord, OrderStatus } from "@/constants";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import { useEffect } from "react";
type SuccessfulOrdersProps = {
  orders: IOrder[] | null;
  toggleOrderChanged: () => void;
};
export const SuccessfulOrders: React.FC<SuccessfulOrdersProps> = ({
  orders,
  toggleOrderChanged,
}) => {
  const router = useRouter();
  const { errorMessage, callApi: callOrderApi } = useApi<void>();

  const handleDeleteOrder = async (orderId: string) => {
    await callOrderApi(async () => {
      const url = `/orders/delete/${orderId}`;
      await apiService.delete(url);
      Alert.alert("Xóa đơn hàng thành công!");
      toggleOrderChanged();
    });
  };

  useEffect(() => {
    if (errorMessage) {
      console.error("❌ Lỗi khi xóa hóa đơn:", errorMessage);
    }
  }, [errorMessage]);

  return (
    <ScrollView>
      {orders?.map((order, index) => (
        <TouchableOpacity
          className="flex-1 bg-white p-4"
          key={index}
          onPress={() => router.push(`/(dashboard)/order/${order.id}`)}
        >
          <View className="bg-white p-4 rounded-lg shadow-md mb-3">
            <Text className="text-lg font-semibold text-gray-800">
              Mã đơn: <Text className="text-gray-600">{order.id}</Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Tổng cộng:{" "}
              <Text className="text-gray-600">
                {order.orderCost.toLocaleString("vi-VN")}₫
              </Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Ngày tạo:{" "}
              <Text className="text-gray-600">
                {new Date(order.orderTime).toLocaleDateString("vi-VN")}
              </Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Thời gian:{" "}
              <Text className="text-gray-600">
                {new Date(order.orderTime).toLocaleTimeString("vi-VN")}
              </Text>
            </Text>

            <View className="flex-row items-center mt-4">
              <Text className="text-green-500 font-semibold">
                {OrderRecord[order.orderStatus as OrderStatus]}
              </Text>
              <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded-md ml-auto"
                onPress={() => handleDeleteOrder(order.id || "")}
              >
                <Text className="text-white font-semibold">Xóa đơn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
