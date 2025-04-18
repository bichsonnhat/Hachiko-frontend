import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const PaymentFailedScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log("Params:", params);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Image
        source={require("@/assets/images/payment-failed.png")}
        style={{ width: 180, height: 180 }}
        resizeMode="contain"
      />
      <Text className="text-xl font-bold text-red-600 mt-6">
        Thanh toán thất bại!
      </Text>
      <Text className="text-base text-gray-500 mt-2 text-center">
        Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/order")}
        className="mt-8 px-6 py-3 bg-red-600 rounded-full"
      >
        <Text className="text-white font-semibold text-base">Thử lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentFailedScreen;
