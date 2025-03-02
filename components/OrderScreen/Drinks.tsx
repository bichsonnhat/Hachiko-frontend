import React from "react";
import { View, Text } from "react-native";
import { DrinkSlotHorizontal } from "./DrinkSlotHorizontal";
import { DrinkPropertie } from "@/constants";

type DrinksProps = {
  title: string;
  drinks: DrinkPropertie[];
};

export const Drinks: React.FC<DrinksProps> = ({ title, drinks }) => {
  return (
    <View className="flex-col gap-4 pb-4">
      <Text className="font-bold text-xl pl-4">{title}</Text>
      <View className="flex-col gap-2">
        {drinks.map((drink, index) => (
          <View key={index} className="bg-white p-4 rounded-lg">
            <DrinkSlotHorizontal drink={drink} />
          </View>
        ))}
      </View>
    </View>
  );
};
