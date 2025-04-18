import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { IFavouriteProductsResponse } from "@/constants";
import { MinusIcon } from "lucide-react-native";

type DrinkFavouriteProps = {
  drinks: IFavouriteProductsResponse | null;
  modalVisible: boolean;
  handleModalClose: () => void;
  handleUnlike: (productId: string) => void;
  userId: string;
};

export const DrinkFavourite: React.FC<DrinkFavouriteProps> = ({
  drinks,
  modalVisible,
  handleModalClose,
  handleUnlike,
  userId,
}) => {
  const extractFavouriteProductId = (
    userId: string,
    productId: string
  ): string | undefined => {
    const matched = drinks?.favouriteProducts.find(
      (drink) => drink.userId === userId && drink.productId === productId
    );
    return matched?.id;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleModalClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-full h-full bg-gray-100">
          <View className="flex flex-row justify-center items-center px-4 py-2 bg-white mb-4">
            <Text className="font-bold text-xl">Các sản phẩm yêu thích</Text>
          </View>
          <ScrollView className="flex-1 gap-5">
            {drinks?.products.map((drink) => (
              <View
                className="relative rounded-2xl p-3 shadow-lg bg-white flex-row items-center gap-4 mb-2"
                key={drink.id}
              >
                <View className="w-1/3 h-32 rounded-lg">
                  <Image
                    source={{ uri: drink.imageUrl }}
                    className="w-full h-full rounded-2xl"
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-1 flex-row items-center justify-between">
                  <View className="flex-col gap-2 max-w-[160px]">
                    <Text className="font-semibold">{drink.title}</Text>
                    <Text>{drink.price.toLocaleString("vi-VN")}đ</Text>
                  </View>
                  <TouchableOpacity
                    className={`w-8 h-8 p-[2px] rounded-full flex items-center justify-center}`}
                    onPress={() => {
                      const favId = extractFavouriteProductId(
                        userId,
                        drink.id || ""
                      );
                      if (favId) {
                        handleUnlike(favId);
                        handleModalClose();
                      }
                    }}
                  >
                    <MinusIcon size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
