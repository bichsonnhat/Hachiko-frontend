import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

type Order = {
  id: string;
  total: number;
  items: {
    id: number;
    name: string;
    size: string;
    quantity: number;
    price: number;
    note?: string;
    image: ImageSourcePropType;
  }[];
};

export default function OrderDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
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

  const order: Order = {
    id: (id as string) || "",
    total: 1029000,
    items: [
      {
        id: 1,
        name: "Phin Sữa Tươi Bánh Flan 1",
        size: "Lớn",
        quantity: 3,
        price: 49000,
        note: "Kem Thêm",
        image: require("@/assets/images/Products/tra-xanh-nong.jpg"),
      },
      {
        id: 2,
        name: "Trà Xanh Espresso Marble 2",
        size: "Lớn",
        quantity: 2,
        price: 49000,
        note: "Ít đường",
        image: require("@/assets/images/Products/ca-phe-goi.jpg"),
      },
      {
        id: 3,
        name: "Phin Sữa Tươi Bánh Flan 3",
        size: "Lớn",
        quantity: 4,
        price: 49000,
        note: "Cho thêm đá",
        image: require("@/assets/images/Products/thung-ca-phe.jpg"),
      },
      {
        id: 4,
        name: "Phin Sữa Tươi Bánh Flan 4",
        size: "Lớn",
        quantity: 5,
        price: 49000,
        note: "Không đường",
        image: require("@/assets/images/Products/tra-sua-o-long.png"),
      },
      {
        id: 5,
        name: "Phin Sữa Tươi Bánh Flan 5",
        size: "Lớn",
        quantity: 1,
        price: 49000,
        note: "Không đá",
        image: require("@/assets/images/Products/tra-xanh-nong.jpg"),
      },
      {
        id: 6,
        name: "Phin Sữa Tươi Bánh Flan 6",
        size: "Lớn",
        quantity: 2,
        price: 49000,
        note: "Cho tôi trân châu",
        image: require("@/assets/images/Products/thung-ca-phe.jpg"),
      },
      {
        id: 7,
        name: "Phin Sữa Tươi Bánh Flan 7",
        size: "Lớn",
        quantity: 7,
        price: 49000,
        image: require("@/assets/images/Products/tra-sua-o-long.png"),
      },
    ],
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        {order.items.map((item) => (
          <View key={item.id} className="mb-4 border-b border-gray-300 pb-2">
            <View className="flex-row">
              <Image source={item.image} className="w-16 h-16 rounded-md" />
              <View className="flex-1 ml-4">
                <Text className="text-base font-semibold">{item.name}</Text>
                <Text className="text-gray-500">
                  Kích cỡ: <Text className="font-bold">{item.size}</Text>
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
        <Text className="text-lg font-semibold text-center">Tổng cộng</Text>
        <View className="flex-row justify-between mt-2">
          <Text className="text-gray-600">Thành tiền</Text>
          <Text className="text-black font-semibold">
            {order.total.toLocaleString()}₫
          </Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-gray-600">Phí vận chuyển</Text>
          <Text className="text-black font-semibold">0₫</Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-gray-600">Giảm giá</Text>
          <Text className="text-black font-semibold">0₫</Text>
        </View>
        <View className="flex-row justify-between mt-2 border-t border-gray-300 pt-2">
          <Text className="text-xl font-bold">Tổng cộng</Text>
          <Text className="text-xl font-bold text-orange-600">
            {order.total.toLocaleString()}₫
          </Text>
        </View>

        <View className="flex-row mt-4">
          <TouchableOpacity className="flex-1 bg-green-500 p-3 rounded-lg mx-2">
            <Text className="text-white text-center font-bold">Xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-red-500 p-3 rounded-lg mx-2">
            <Text className="text-white text-center font-bold">Hủy đơn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
