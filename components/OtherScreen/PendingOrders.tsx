import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { IFullOrder, OrderRecord, OrderStatus } from "@/constants";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";

type PendingOrdersProps = {
  onOrderChange: () => void;
  orderChanged: boolean;
};

export const PendingOrders: React.FC<PendingOrdersProps> = ({
  onOrderChange,
  orderChanged,
}) => {
  //hard coded data for user
  const userId = "67fe6f866bcac94e258e3a20";

  const router = useRouter();
  const { errorMessage, callApi: callPendingOrderApi } = useApi<void>();

  const [orders, setOrders] = useState<IFullOrder[]>([]);

  const handleCancelledOrder = async (order: IFullOrder) => {
    await callPendingOrderApi(async () => {
      order.order.orderStatus = OrderStatus.CANCELLED;
      const { data } = await apiService.put("/orders", order);
      if (data) {
        Alert.alert("Hủy đơn hàng thành công");
        onOrderChange();
      }
    });
  };
  const handleCompletedOrder = async (order: IFullOrder) => {
    await callPendingOrderApi(async () => {
      order.order.orderStatus = OrderStatus.COMPLETED;
      const { data } = await apiService.put("/orders", order);
      if (data) {
        Alert.alert("Xác nhận đơn hàng thành công");
        onOrderChange();
      }
    });
  };

  useEffect(() => {
    const fetchPendingOrders = async () => {
      await callPendingOrderApi(async () => {
        const queryString = new URLSearchParams({
          orderStatus: OrderStatus.DELIVERING,
        });
        const url = `/orders/customer/${userId}?${queryString}`;
        const { data } = await apiService.get(url);
        if (data) {
          setOrders(data);
        }
      });
    };
    fetchPendingOrders();
  }, [orderChanged]);

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
              <Text className="text-orange-500 font-semibold">
                {OrderRecord[order.order.orderStatus as OrderStatus]}
              </Text>
              <TouchableOpacity
                className="ml-auto bg-green-500 px-4 py-2 rounded-md"
                onPress={() => handleCompletedOrder(order)}
              >
                <Text className="text-white font-semibold">Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-2 bg-red-500 px-4 py-2 rounded-md"
                onPress={() => handleCancelledOrder(order)}
              >
                <Text className="text-white font-semibold">Hủy đơn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
