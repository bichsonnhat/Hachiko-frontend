import { ICategory } from "@/constants";
import { useRef } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  Animated,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";

type CategoryProps = {
  categories: ICategory[];
  loading: boolean;
  scrollToCategory: (categoryId: string) => void;
};

export const Category: React.FC<CategoryProps> = ({
  categories,
  loading,
  scrollToCategory,
}) => {
  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += 2) {
    groupedCategories.push(categories.slice(i, i + 2));
  }

  const scrollX = useRef(new Animated.Value(0)).current;
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = SCREEN_WIDTH / groupedCategories.length;
  const SCROLLBAR_WIDTH = SCREEN_WIDTH / (groupedCategories.length * 2);

  if (loading) {
    return (
      <View className="p-4 relative h-48 justify-center">
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <View className="p-4 relative mt-16">
      <FlatList
        data={groupedCategories}
        keyExtractor={(_item, index) => `group-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="mx-2">
            {item.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="items-center mb-4 h-32"
                onPress={() => scrollToCategory(category.id || "")}
              >
                <View className="w-20 h-20 rounded-full flex items-center justify-center">
                  <Image
                    source={{ uri: category.imgUrl }}
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </View>
                <Text
                  className="text-base text-center mt-2 w-20 font-medium"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {category.name}
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
              width: SCROLLBAR_WIDTH * 0.75,
              height: "100%",
              backgroundColor: "#FF8C00",
              borderRadius: 999,
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [
                      0,
                      ITEM_WIDTH * (groupedCategories.length - 1),
                    ],
                    outputRange: [0, (SCREEN_WIDTH - SCROLLBAR_WIDTH) / 16],
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
