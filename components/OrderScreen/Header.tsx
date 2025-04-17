import { useEffect, useState } from "react";
import { ThemedText } from "../ThemedText";
import {
  TouchableOpacity,
  Image,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { DrinkFavourite } from "./DrinkFavourite";
import { IFavouriteProductsResponse } from "@/constants";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import { useBoolean } from "@/hooks/useBoolean";

export const Header = () => {
  const safeHeight = StatusBar.currentHeight || 0;

  //hard code userId for testing
  const userId = "67ea8e54c54fd6723fbf8f0e";

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [favouriteProducts, setFavouriteProducts] =
    useState<IFavouriteProductsResponse | null>(null);
  const { callApi: callFavouriteApi } = useApi<void>();
  const { value: isFavouriteProductsChanged, toggle: productsChanged } =
    useBoolean(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
    productsChanged();
  };

  const handleUnlike = async (id: string) => {
    await callFavouriteApi(async () => {
      await apiService.delete(`/favourite-products/${id}`);
      productsChanged();
      Alert.alert("Xoá sản phẩm yêu thích thành công!");
    });
  };

  useEffect(() => {
    const fetchFavouriteProducts = async () => {
      await callFavouriteApi(async () => {
        const { data } = await apiService.get(`/favourite-products/${userId}`);
        if (data) {
          setFavouriteProducts(data);
        }
      });
    };
    fetchFavouriteProducts();
  }, [isFavouriteProductsChanged]);

  return (
    <>
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
          <TouchableOpacity onPress={handleOpenModal}>
            <Image
              source={require("@/assets/images/OrderScreen/heart-icon.png")}
              className="scale-125"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <DrinkFavourite
        modalVisible={modalVisible}
        handleModalClose={handleModalClose}
        drinks={favouriteProducts}
        handleUnlike={handleUnlike}
        userId={userId}
      />
    </>
  );
};
