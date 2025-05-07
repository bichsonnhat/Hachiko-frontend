import { SafeAreaView, View, Text, ActivityIndicator } from "react-native";

import Header from "@/components/HomeScreen/Header";
import Slider from "@/components/HomeScreen/Slider";
import Category from "@/components/HomeScreen/Category";
import ProductGridSection from "@/components/HomeScreen/ProductGridSection";
import apiService from "@/constants/config/axiosConfig";
import { ProductFromAPI } from "@/constants";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useApi } from "@/hooks/useApi";
import { IAdvertisement } from "@/constants/interface/advertisement.interface";
export default function HomeScreen() {
  const [products, setProducts] = useState<ProductFromAPI[]>([]);
  const [advertisement, setAdvertisement] = useState<IAdvertisement[]>([]);

  const {
    loading: productLoading,
    errorMessage: productErrorMessage,
    callApi: callProductApi,
  } = useApi<void>();

  const {
    loading: advertisementLoading,
    errorMessage: advertisementErrorMessage,
    callApi: callAdvertisementApi,
  } = useApi<void>();

  const fetchProductData = async () => {
    await callProductApi(async () => {
      const response = await apiService.get<ProductFromAPI[]>(
        "/products?category_id=67fcd3d24569c746958d067f"
      );
      setProducts(response.data);
    });
  };

  const fetchAdvertisementData = async () => {
    await callAdvertisementApi(async () => {
      const response = await apiService.get<IAdvertisement[]>(
        "/advertisements"
      );

      setAdvertisement(response.data);
    });
  };

  useEffect(() => {
    fetchProductData();
    fetchAdvertisementData();
  }, []);

  useEffect(() => {
    if (productErrorMessage) {
      console.error("❌ Lỗi khi lấy danh sách sản phẩm:", productErrorMessage);
    }

    if (advertisementErrorMessage) {
      console.error("❌ Lỗi khi lấy danh sách banner:", advertisementErrorMessage);
    }
  }, [productErrorMessage, advertisementErrorMessage]);

  return (
    <SafeAreaView className="flex bg-white h-full">
      <Header />
      {advertisementLoading || productLoading ? (
        <View className="flex-1 items-center justify-center h-full mt-5">
          <ActivityIndicator size="large" color="#FF8C00" />
        </View>
      ) : (
        <>
          <Slider advertisements={advertisement} />
          <Category />
          <ProductGridSection title={"Món mới phải thử"} products={products} />
        </>
      )}
    </SafeAreaView>
  );
}
