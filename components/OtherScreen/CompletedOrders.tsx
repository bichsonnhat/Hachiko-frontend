import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";

export const CompletedOrders = () => {
  const orders = [
    {
      id: 1,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Đã xác nhận",
    },
    {
      id: 2,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Đã xác nhận",
    },
    {
      id: 3,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Đã xác nhận",
    },
    {
      id: 4,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Đã xác nhận",
    },
    {
      id: 5,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Đã xác nhận",
    },
  ];
  return (
    <ScrollView>
      {orders.map((order) => (
        <View className="flex-1 bg-white p-4" key={order.id}>
          <View className="bg-white p-4 rounded-lg shadow-md mb-3">
            <Text className="text-lg font-semibold text-gray-800">
              Mã đơn: <Text className="text-gray-600">{order.id}</Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Tổng cộng:{" "}
              <Text className="text-gray-600">
                {order.total.toLocaleString("vi-VN")}₫
              </Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Ngày tạo: <Text className="text-gray-600">{order.date}</Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Thời gian: <Text className="text-gray-600">{order.time}</Text>
            </Text>

            <View className="flex-row items-center mt-4">
              <Text className="text-green-500 font-semibold">
                {order.status}
              </Text>
              <TouchableOpacity className="ml-auto bg-orange-400 px-4 py-2 rounded-md">
                <Text className="text-white font-semibold">Hủy đơn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
