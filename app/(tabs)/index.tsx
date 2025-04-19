import { SafeAreaView, View, Text } from "react-native";

import Header from "@/components/HomeScreen/Header";
import Slider from "@/components/HomeScreen/Slider";
import { ThemedView } from "@/components/ThemedView";
import Category from "@/components/HomeScreen/Category";
import ProductGridSection from "@/components/HomeScreen/ProductGridSection";
import apiService from "@/constants/config/axiosConfig";
import { ProductFromAPI } from "@/constants";
import { useEffect, useState } from "react";
import { router } from "expo-router";
export default function HomeScreen() {
  const [products, setProducts] = useState<ProductFromAPI[]>([]);

  const getHighlightProducts = async () => {
    try {
      console.log("Api url: ", process.env.EXPO_PUBLIC_API_BASE_URL);
      const response = await apiService.get<ProductFromAPI[]>(
        "/products?category_id=67fcd3d24569c746958d067f"
      );

      setProducts(response.data);
    } catch (e) {
      console.error("❌ Lỗi khi lấy danh sách sản phẩm:", e);
    }
  };

  useEffect(() => {
    getHighlightProducts();
  }, []);
  return (
    <View className="flex bg-white h-full">
      <Header />
      <Slider />
      <Category />
      <ProductGridSection title={"Món mới phải thử"} products={products} />
    </View>
  );
}
