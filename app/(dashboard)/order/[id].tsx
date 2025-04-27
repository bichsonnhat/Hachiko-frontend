import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { IFullOrder, OrderRecord, OrderStatus } from "@/constants";
import apiService from "@/constants/config/axiosConfig";
import { useApi } from "@/hooks/useApi";

export default function OrderDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const { errorMessage, callApi: callOrderApi } = useApi<void>();
  const [order, setOrder] = useState<IFullOrder | null>(null);

  const handleDeleteOrder = async (orderId: string) => {
    await callOrderApi(async () => {
      const url = `/orders/delete/${orderId}`;
      await apiService.delete(url);
      Alert.alert("Xóa đơn hàng thành công!");
      router.push("/(dashboard)/dashboard");
    });
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchOrderDetails = async () => {
        await callOrderApi(async () => {
          const url = `/orders/${id}`;
          const { data } = await apiService.get(url);
          if (isActive) {
            setOrder(data);
          }
        });
      };
      fetchOrderDetails();

      return () => {
        isActive = false;
        setOrder(null);
      };
    }, [id])
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Chi tiết đơn hàng",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "white",
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (errorMessage) {
      console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", errorMessage);
    }
  }, [errorMessage]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        {order?.orderItems.map((item) => (
          <View key={item.id} className="mb-4 border-b border-gray-300 pb-2">
            <View className="flex-row">
              <Image
                source={{ uri: item.productImage }}
                className="w-16 h-16 rounded-md"
              />
              <View className="flex-1 ml-4">
                <Text className="text-base font-semibold">
                  {item.productName}
                </Text>
                <Text className="text-gray-500">
                  Kích cỡ:{" "}
                  <Text className="font-bold">
                    {item.size === "small" ? "Nhỏ" : "Vừa"}
                  </Text>
                </Text>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">
                    Số lượng: <Text className="font-bold">{item.quantity}</Text>
                  </Text>
                  <Text className="text-gray-500">
                    Giá:{" "}
                    <Text className="font-bold">
                      {item.price.toLocaleString()}₫
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row mt-2">
              <Text className="text-gray-500">Ghi chú: </Text>
              {item.note ? (
                <Text className="text-gray-500 italic">{item.note}</Text>
              ) : (
                <Text className="text-gray-500 italic">Không có</Text>
              )}
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-500">x{item.quantity}</Text>
              <Text className="text-gray-700 font-semibold">
                Thành tiền: {(item.quantity * item.price).toLocaleString()}₫
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View className="bg-gray-100 p-4 shadow-md border-t border-gray-300">
        <Text className="text-lg font-semibold text-center">
          Thông tin khác
        </Text>
        <View className="flex-row justify-between mt-2">
          <Text className="text-gray-600">Ngày đặt hàng</Text>
          <Text className="text-black font-semibold">
            {order?.order.createdAt
              ? new Date(order.order.orderTime).toLocaleDateString("vi-VN")
              : "N/A"}
          </Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-gray-600">Phương thức thanh toán</Text>
          <Text className="text-black font-semibold">
            {order?.order.paymentMethod}
          </Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-gray-600">Địa chỉ giao hàng</Text>
          <Text className="text-black font-semibold">
            {order?.order.orderAddress}
          </Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-gray-600">Trạng thái đơn hàng</Text>
          <Text className="text-black font-semibold">
            {order?.order.orderStatus &&
              OrderRecord[order.order.orderStatus as OrderStatus]}
          </Text>
        </View>
        <View className="flex-row justify-between mt-2 border-t border-gray-300 pt-2">
          <Text className="text-xl font-bold">Giá trị đơn hàng</Text>
          <Text className="text-xl font-bold text-orange-600">
            {order?.order.orderCost.toLocaleString()}₫
          </Text>
        </View>

        <View className={`flex-row mt-4`}>
          <TouchableOpacity
            className="flex-1 bg-red-500 p-3 rounded-lg mx-2"
            onPress={() => handleDeleteOrder(typeof id === "string" ? id : "")}
          >
            <Text className="text-white text-center font-bold">Xóa đơn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
