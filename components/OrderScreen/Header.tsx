import { ThemedText } from "../ThemedText";
import { TouchableOpacity, Image, View } from "react-native";

export const Header = () => {
  return (
    <View className="p-4 pt-10 flex-row justify-between">
      <View className="flex-row items-center gap-2">
        <Image
          source={require("@/assets/images/OrderScreen/category-icon.png")}
        />
        <ThemedText className="font-bold">Danh mục</ThemedText>
      </View>
      <View className="flex-row items-center gap-3">
        <TouchableOpacity>
          <Image
            source={require("@/assets/images/OrderScreen/search-icon.png")}
            className="scale-125"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("@/assets/images/OrderScreen/heart-icon.png")}
            className="scale-125"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
