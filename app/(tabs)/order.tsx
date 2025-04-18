import {
  Category,
  CheckoutBtn,
  Collection,
  Drinks,
  Header,
} from "@/components/OrderScreen";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  ActivityIndicator,
  Text,
} from "react-native";
import apiService from "@/constants/config/axiosConfig";
import { ICategory, IProductByCategory } from "@/constants/interface";
import { useApi } from "@/hooks/useApi";
import React from "react";

export default function OrderScreen() {
  const {
    loading: categoryLoading,
    errorMessage: categoryErrorMessage,
    callApi: callCategoryApi,
  } = useApi<void>();

  const {
    loading: productLoading,
    errorMessage: productErrorMessage,
    callApi: callProductApi,
  } = useApi<void>();
  const [categoryGroups, setCategoryGroups] = useState<IProductByCategory[]>(
    []
  );
  const [categories, setCategories] = useState<ICategory[]>([]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : `Danh mục ${categoryId}`;
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionsRef = useRef<Record<string, React.RefObject<View>>>({});

  const checkHasTopping = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.hasToppings : false;
  };

  const getProductName = (productId: string): string => {
    const product = categoryGroups
      .flatMap((group) => group.products)
      .find((prod) => prod.id === productId);
    return product ? product.title : `Sản phẩm ${productId}`;
  };

  const handleScroll = (categoryId: string) => {
    const section = sectionsRef.current[categoryId]?.current;
    const scrollView = scrollViewRef.current;
    if (section && scrollView) {
      section.measure((x, y) => {
        scrollView.scrollTo({ x: 0, y: y - 32, animated: true });
      });
    }
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      await callCategoryApi(async () => {
        const { data } = await apiService.get("/categories");
        setCategories(data);
      });
    };
    const fetchProductData = async () => {
      await callProductApi(async () => {
        const { data } = await apiService.get("/products/grouped-by-category");
        setCategoryGroups(data);
      });
    };
    fetchCategoryData();
    fetchProductData();
  }, []);
  useEffect(() => {
    const refObj: Record<string, React.RefObject<View>> = {};
    categories.forEach((category) => {
      if (category.id) {
        refObj[category.id] = React.createRef<View>();
      }
    });
    sectionsRef.current = refObj;
  }, [categories]);

  useEffect(() => {
    if (categoryErrorMessage) {
      console.error("❌ Lỗi khi lấy danh sách danh mục:", categoryErrorMessage);
    }
    if (productErrorMessage) {
      console.error("❌ Lỗi khi lấy danh sách sản phẩm:", productErrorMessage);
    }
  }, [categoryErrorMessage, productErrorMessage]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="absolute top-0 left-0 right-0 z-10 bg-white">
          <Header />
        </View>
        <ScrollView className="mt-16" ref={scrollViewRef}>
          <View className="mt-4">
            <Category
              handleScroll={handleScroll}
              categories={categories}
              loading={categoryLoading}
            />
          </View>
          <Collection />
          {productLoading ? (
            <View className="flex-1 items-center justify-center h-full mt-5">
              <ActivityIndicator size="large" color="#FF8C00" />
            </View>
          ) : categories.length === 0 ? (
            <View className="flex-1 items-center justify-center h-full mt-5">
              <Text className="text-lg text-gray-500">Chưa có sản phẩm</Text>
            </View>
          ) : (
            categoryGroups.map((group) => {
              const categoryId = group.categoryID;
              const categoryName = getCategoryName(categoryId);
              return (
                <View key={categoryId} ref={sectionsRef.current[categoryId]}>
                  <Drinks
                    title={categoryName}
                    drinks={group.products}
                    checkHasTopping={checkHasTopping}
                  />
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
      <CheckoutBtn getProductName={getProductName} />
    </SafeAreaView>
  );
}
