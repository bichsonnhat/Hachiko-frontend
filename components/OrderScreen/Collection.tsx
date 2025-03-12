import React from "react";
import { View, Text } from "react-native";
import Slider from "@/components/HomeScreen/Slider";

export const Collection = () => {
  return (
    <View className="flex-col gap-4 pb-4">
      <Text className="font-bold text-xl pl-4">Bộ sưu tập</Text>
      <Slider />
    </View>
  );
};
