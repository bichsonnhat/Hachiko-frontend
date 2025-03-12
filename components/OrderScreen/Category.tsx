import React, { useRef } from "react";
import {
  ImageSourcePropType,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";

type CategoryPropertie = {
  category_img: ImageSourcePropType;
  category_name: string;
};

type CategoryProps = {
  handleScroll: (category: string) => void;
};

export const Category: React.FC<CategoryProps> = ({ handleScroll }) => {
  const categories: CategoryPropertie[] = [
    {
      category_img: require("@/assets/images/OrderScreen/new-drinks.png"),
      category_name: "Món mới",
    },
    {
      category_img: require("@/assets/images/OrderScreen/fruit-tea.png"),
      category_name: "Trà trái cây",
    },
    {
      category_img: require("@/assets/images/OrderScreen/milktea.png"),
      category_name: "Trà sữa",
    },
    {
      category_img: require("@/assets/images/OrderScreen/greentea.png"),
      category_name: "Trà xanh",
    },
    {
      category_img: require("@/assets/images/OrderScreen/ice-blended.png"),
      category_name: "Đá xay",
    },
    {
      category_img: require("@/assets/images/OrderScreen/coffee.png"),
      category_name: "Cà phê",
    },
    {
      category_img: require("@/assets/images/OrderScreen/sweets.png"),
      category_name: "Bánh ngọt",
    },
    {
      category_img: require("@/assets/images/OrderScreen/not-vegetable-meal.png"),
      category_name: "Bánh mặn",
    },
    {
      category_img: require("@/assets/images/OrderScreen/home-dishes.png"),
      category_name: "Cơm nhà",
    },
    {
      category_img: require("@/assets/images/OrderScreen/hot-drinks.png"),
      category_name: "Đồ uống nóng",
    },
    {
      category_img: require("@/assets/images/OrderScreen/coffee-and-tea-bag.png"),
      category_name: "Đồ uống đóng gói",
    },
    {
      category_img: require("@/assets/images/OrderScreen/topping.png"),
      category_name: "Topping",
    },
  ];
  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += 2) {
    groupedCategories.push(categories.slice(i, i + 2));
  }

  const scrollX = useRef(new Animated.Value(0)).current;
  const ITEM_WIDTH = 140;
  const SCROLLBAR_WIDTH = 20;

  return (
    <View className="p-4 relative">
      <FlatList
        data={groupedCategories}
        keyExtractor={(_item, index) => `group-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="mx-2">
            {item.map((category) => (
              <TouchableOpacity
                key={category.category_name}
                className="items-center mb-4 h-32"
                onPress={() => handleScroll(category.category_name)}
              >
                <View className="w-20 h-20 rounded-full flex items-center justify-center">
                  <Image
                    source={category.category_img}
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-md text-center mt-2 w-20 font-medium">
                  {category.category_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      <View className="absolute bottom-0 left-0 right-0 flex items-center">
        <View className="w-10 h-2 bg-gray-300 rounded-full overflow-hidden">
          <Animated.View
            style={{
              width: SCROLLBAR_WIDTH,
              height: "100%",
              backgroundColor: "#FF8C00",
              borderRadius: 999,
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, ITEM_WIDTH * groupedCategories.length],
                    outputRange: [0, 70],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          />
        </View>
      </View>
    </View>
  );
};
