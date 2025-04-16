import React from "react";
import { View, Text } from "react-native";
import { DrinkSlotHorizontal } from "./DrinkSlotHorizontal";
import { IProduct } from "@/constants";

interface DrinksProps {
  title: string;
  drinks: IProduct[];
  checkHasTopping: (categoryId: string) => boolean;
}

export const Drinks: React.FC<DrinksProps> = ({
  title,
  drinks,
  checkHasTopping,
}) => {
  return (
    <View className="flex-col pb-6">
      <Text className="font-bold text-xl pl-4">{title}</Text>
      <View>
        {drinks.map((drink, index) => (
          <View key={index} className="p-2 rounded-lg">
            <DrinkSlotHorizontal drink={drink} check={checkHasTopping} />
          </View>
        ))}
      </View>
    </View>
  );
};
