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
    <View className="flex-col pb-6">
      <Text className="font-bold text-xl pl-4">{title}</Text>
      <View>
        {drinks.map((drink, index) => (
          <View key={index} className="p-2 rounded-lg">
            <DrinkSlotHorizontal drink={drink} />
          </View>
        ))}
      </View>
    </View>
  );
};
