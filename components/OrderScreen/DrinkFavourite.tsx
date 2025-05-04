import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { IFavouriteProductsResponse } from "@/constants";
import { HeartOff, MinusIcon } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";

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
  const insets = useSafeAreaInsets();

  const extractFavouriteProductId = (
    userId: string,
    productId: string
  ): string | undefined => {
    const matched = drinks?.favouriteProducts.find(
      (drink) => drink.userId === userId && drink.productId === productId
    );
    return matched?.id;
  };

  const renderItem = ({
    item,
  }: {
    item: { id: string; imageUrl: string; title: string; price: number };
  }) => {
    return (
      <View
        className="relative rounded-xl p-3 mx-4 mb-3 shadow-sm bg-white flex-row items-center gap-3 border border-gray-100"
        key={item.id}
      >
        <View className="w-[30%] h-32 rounded-lg">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-full rounded-xl"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 flex-row items-center justify-between">
          <View className="flex-col gap-2 max-w-[160px]">
            <Text className="font-semibold text-base">{item.title}</Text>
            <Text className="text-gray-700">{item.price.toLocaleString("vi-VN")}đ</Text>
          </View>
          <TouchableOpacity
            className="w-9 h-9 rounded-full flex items-center justify-center"
            onPress={() => {
              const favId = extractFavouriteProductId(userId, item.id);
              if (favId) {
                handleUnlike(favId);
              }
            }}
          >
            <HeartOff size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleModalClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-full h-full bg-white" style={{ paddingTop: insets.top }}>
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <View className="w-8 h-8" />
            <Text className="font-bold text-xl text-center flex-1">
              Sản phẩm yêu thích
            </Text>
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center"
              onPress={handleModalClose}
            >
              <MinusIcon size={24} color="black" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={(drinks?.products as Array<any>) || []}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ 
              paddingTop: 12,
              paddingBottom: Math.max(insets.bottom + 10, 20)
            }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center h-full mt-5">
                <Text className="text-lg text-gray-500">Chưa có sản phẩm</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};
