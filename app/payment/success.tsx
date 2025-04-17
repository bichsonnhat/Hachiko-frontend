import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const PaymentSuccessScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log("Params:", params);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Image
        source={require("@/assets/images/payment-success.png")}
        style={{ width: 180, height: 180 }}
        resizeMode="contain"
      />
      <Text className="text-xl font-bold text-green-600 mt-6">
        Thanh toán thành công!
      </Text>
      <Text className="text-base text-gray-500 mt-2 text-center">
        Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)")}
        className="mt-8 px-6 py-3 bg-green-600 rounded-full"
      >
        <Text className="text-white font-semibold text-base">
          Quay về Trang chủ
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentSuccessScreen;
