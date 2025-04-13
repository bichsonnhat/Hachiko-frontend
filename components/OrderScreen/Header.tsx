import { ThemedText } from "../ThemedText";
import {
  TouchableOpacity,
  Image,
  View,
  SafeAreaView,
  StatusBar,
} from "react-native";

export const Header = () => {
  const safeHeight = StatusBar.currentHeight || 0;

  return (
    <SafeAreaView
      style={{ marginTop: safeHeight }}
      className="flex-row justify-between px-4"
    >
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
    </SafeAreaView>
  );
};
