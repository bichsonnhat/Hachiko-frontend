import { RatingOrder } from "@/components/OtherScreen";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function OrderFeedback() {
  const orders = [
    {
      id: 1,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Chờ xác nhận",
    },
    {
      id: 2,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Chờ xác nhận",
    },
    {
      id: 3,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Chờ xác nhận",
    },
    {
      id: 4,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Chờ xác nhận",
    },
    {
      id: 5,
      total: 245000,
      date: "19/05/2024",
      time: "08:50:12",
      status: "Chờ xác nhận",
    },
  ];

  const navigation = useNavigation();
  const [feedback, setFeedback] = useState<string>("");
  const [rating, setRating] = useState<number>(3);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    orders.map((order) => ({
      label: `Đơn #${order.id} - ${order.total.toLocaleString()}₫`,
      value: order.id,
    }))
  );

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

  const handleSubmit = () => {
    console.log("Đơn hàng:", selectedOrder);
    console.log("Rating:", rating);
    console.log("Feedback:", feedback);
    alert("Đánh giá của bạn đã được gửi đi!");
  };

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
