import { ThemedText } from "../ThemedText";
import { TouchableOpacity, Image, View } from "react-native";
import { Search as SearchIcon, Heart as HeartIcon } from "lucide-react-native";

export const Header = () => {
  return (
    <View className="p-4 pt-10 flex-row justify-between">
      <View className="flex-row items-center gap-2">
        <Image
          source={require("@/assets/images/OrderScreen/category-icon.png")}
        />
        <ThemedText className="font-bold">Danh mục</ThemedText>
      </View>
      <View className="flex-row items-center gap-2">
        <TouchableOpacity>
          <SearchIcon color={"black"} size={30} />
        </TouchableOpacity>
        <TouchableOpacity>
          <HeartIcon color={"black"} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
