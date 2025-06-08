import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useApi } from "@/hooks/useApi";
import { useBoolean } from "@/hooks/useBoolean";
import React, { useEffect, useState } from "react";
import { IFullOrder, OrderRecord, OrderStatus } from "@/constants";
import apiService from "@/constants/config/axiosConfig";
import { useAuth } from "@clerk/clerk-expo";

type CancelledOrdersProps = {
  orderChanged: boolean;
};

export const CancelledOrders: React.FC<CancelledOrdersProps> = ({
  orderChanged,
}) => {
  //hard coded data for user
  const { userId } = useAuth();

  const router = useRouter();
  const { errorMessage, callApi: callCancelledOrderApi } = useApi<void>();
  const { value: isOrderChanged, toggle: orderChangedToggle } =
    useBoolean(false);

  const [orders, setOrders] = useState<IFullOrder[]>([]);

  const handleDeleteOrder = async (orderId: string) => {
    await callCancelledOrderApi(async () => {
      const url = `/orders/delete/${orderId}`;
      await apiService.delete(url);
      Alert.alert("Xóa đơn hàng thành công!");
      orderChangedToggle();
    });
  };

  useEffect(() => {
    const fetchPendingOrders = async () => {
      await callCancelledOrderApi(async () => {
        const queryString = new URLSearchParams({
          orderStatus: OrderStatus.CANCELLED,
        });
        const url = `/orders/customer/${userId}?${queryString}`;
        const { data } = await apiService.get(url);
        if (data) {
          setOrders(data);
        }
      });
    };
    fetchPendingOrders();
  }, [isOrderChanged, orderChanged]);

  useEffect(() => {
    if (errorMessage) {
      console.error("❌ Lỗi khi lấy danh sách đơn hàng:", errorMessage);
    }
  }, [errorMessage]);

  return (
    <ScrollView>
      {orders.map((order) => (
        <TouchableOpacity
          className="flex-1 bg-white p-4"
          key={order.order.id}
          onPress={() => router.push(`/other/order-history/${order.order.id}`)}
        >
          <View className="bg-white p-4 rounded-lg shadow-md mb-3">
            <Text className="text-lg font-semibold text-gray-800">
              Mã đơn: <Text className="text-gray-600">{order.order.id}</Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Tổng cộng:{" "}
              <Text className="text-gray-600">
                {order.order.orderCost.toLocaleString("vi-VN")}₫
              </Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Ngày tạo:{" "}
              <Text className="text-gray-600">
                {new Date(order.order.orderTime).toLocaleDateString("vi-VN")}
              </Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Thời gian:{" "}
              <Text className="text-gray-600">
                {new Date(order.order.orderTime).toLocaleTimeString("vi-VN")}
              </Text>
            </Text>

            <View className="flex-row items-center mt-4">
              <Text className="text-red-500 font-semibold">
                {OrderRecord[order.order.orderStatus as OrderStatus]}
              </Text>
              <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded-md ml-auto"
                onPress={() => handleDeleteOrder(order.order.id || "")}
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
