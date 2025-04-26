import { RatingOrder } from "@/components/OtherScreen";
import { IFullOrder, IOrderFeedback, OrderStatus } from "@/constants";
import apiService from "@/constants/config/axiosConfig";
import { useApi } from "@/hooks/useApi";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

export default function OrderFeedback() {
  //hard coded data for user
  const userId = "67fe6f866bcac94e258e3a20";
  const username = "Nguyễn Văn A";

  const { errorMessage, callApi: callSuccessOrderApi } = useApi<void>();

  const navigation = useNavigation();
  const [feedback, setFeedback] = useState<string>("");
  const [rating, setRating] = useState<number>(3);
  const [selectedOrder, setSelectedOrder] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);

  const handleClear = () => {
    setFeedback("");
    setRating(3);
    setSelectedOrder("");
  };

  const handleSubmit = async () => {
    await callSuccessOrderApi(async () => {
      const payload: IOrderFeedback = {
        userId: userId,
        username,
        orderId: selectedOrder,
        feedbackContent: feedback,
        rating: rating,
      };

      const { data } = await apiService.post("/feedback/order", payload);
      if (data) {
        handleClear();
        alert("Đánh giá của bạn đã được gửi đi!");
      }
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      await callSuccessOrderApi(async () => {
        const queryString = new URLSearchParams({
          orderStatus: OrderStatus.COMPLETED,
        });
        const url = `/orders/customer/${userId}?${queryString}`;
        const { data } = await apiService.get(url);
        if (data) {
          const orders = data.map((order: IFullOrder) => {
            const totalPrice = order.orderItems.reduce(
              (prev, current) => prev + current.price * current.quantity,
              0
            );
            return {
              label: `Đơn ${order.order.id} - ${totalPrice.toLocaleString(
                "vi-VN"
              )}đ`,
              value: order.order.id,
            };
          });
          setItems(orders);
        }
      });
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đánh giá đơn hàng",
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
      console.error("❌ Lỗi khi gửi phản hồi:", errorMessage);
    }
  }, [errorMessage]);

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <Text className="text-lg font-base mb-4">
        Hãy cho chúng tôi biết trải nghiệm của bạn! 🤔
      </Text>
      <DropDownPicker
        open={open}
        value={selectedOrder}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedOrder}
        setItems={setItems}
        placeholder="Chọn đơn hàng"
        containerStyle={{ marginBottom: 10 }}
        dropDownContainerStyle={{
          borderColor: "#d1d5db",
        }}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        style={{
          borderColor: "#d1d5db",
          borderWidth: 1,
          borderRadius: 10,
        }}
      />
      <View className="flex items-center justify-center m-4">
        <RatingOrder rating={rating} setRating={setRating} />
      </View>

      <TextInput
        className="border border-gray-300 rounded-md p-3 mt-4"
        placeholder="Nhập phản hồi của bạn..."
        multiline
        numberOfLines={4}
        value={feedback}
        onChangeText={setFeedback}
      />
      <TouchableOpacity
        className={`p-3 rounded-md mt-4 ${
          !rating || !selectedOrder ? "bg-gray-300" : "bg-orange-500"
        }`}
        onPress={handleSubmit}
        disabled={!rating || !selectedOrder}
      >
        <Text className="text-white text-center font-semibold">
          Gửi đánh giá
        </Text>
      </TouchableOpacity>
    </View>
  );
}
