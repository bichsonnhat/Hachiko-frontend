import React, { useEffect, useState } from "react";
import { ThemedText } from "../ThemedText";
import {
  TouchableOpacity,
  Image,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { DrinkFavourite } from "./DrinkFavourite";
import { IFavouriteProductsResponse } from "@/constants";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import { useBoolean } from "@/hooks/useBoolean";
import { HeartIcon, SearchIcon } from "lucide-react-native";
import { router } from 'expo-router';

export const Header = () => {
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
      <View
        className="border-b border-gray-100"
        style={{
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}
      >
        <SafeAreaView>
          <View className="flex-row justify-between items-center px-4 py-3">
            <View className="flex-row items-center gap-2">
              <Image
                source={require("@/assets/images/OrderScreen/category-icon.png")}
                style={{ width: 24, height: 24 }}
              />
              <ThemedText className="font-bold text-base">Danh mục</ThemedText>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => router.push('/search')}
                className="w-10 h-10 flex items-center justify-center"
              >
                <SearchIcon size={22} color="black" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleOpenModal}
                className="w-10 h-10 flex items-center justify-center"
              >
                <HeartIcon size={22} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
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
