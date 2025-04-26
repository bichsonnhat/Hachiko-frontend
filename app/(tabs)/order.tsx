import {
  Category,
  CheckoutBtn,
  Collection,
  DrinkSlotHorizontal,
  Header,
} from "@/components/OrderScreen";
import { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ActivityIndicator,
  Text,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import apiService from "@/constants/config/axiosConfig";
import { ICategory, IProductByCategory } from "@/constants/interface";
import { useApi } from "@/hooks/useApi";
import React from "react";

type SectionItem = {
  type: "collection" | "category";
  categoryId?: string;
  categoryName?: string;
  products?: any[];
};

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
  const [sectionData, setSectionData] = useState<SectionItem[]>([]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : `Danh mục ${categoryId}`;
  };

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
    if (categoryGroups.length > 0) {
      const sections: SectionItem[] = [
        { type: "collection" },
        ...categoryGroups.map((group) => ({
          type: "category" as const,
          categoryId: group.categoryID,
          categoryName: getCategoryName(group.categoryID),
          products: group.products,
        })),
      ];
      setSectionData(sections);
    }
  }, [categoryGroups]);

  useEffect(() => {
    if (categoryErrorMessage) {
      console.error("❌ Lỗi khi lấy danh sách danh mục:", categoryErrorMessage);
    }
    if (productErrorMessage) {
      console.error("❌ Lỗi khi lấy danh sách sản phẩm:", productErrorMessage);
    }
  }, [categoryErrorMessage, productErrorMessage]);

  const renderItem = ({ item }: ListRenderItemInfo<SectionItem>) => {
    if (item.type === "collection") {
      return (
        <View className="mt-4">
          <Category categories={categories} loading={categoryLoading} />
          <Collection />
        </View>
      );
    }

    return (
      <View className="flex-col pb-6">
        <Text className="font-bold text-xl pl-4 mt-6">{item.categoryName}</Text>
        <View>
          {item.products?.map((drink, index) => (
            <View key={index} className="p-2 rounded-lg">
              <DrinkSlotHorizontal drink={drink} check={checkHasTopping} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const keyExtractor = (item: SectionItem, index: number) => {
    if (item.type === "collection") return "collection";
    return `cat-${item.categoryId ?? index}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="absolute top-0 left-0 right-0 z-10 bg-white">
          <Header />
        </View>

        {productLoading ? (
          <View className="flex-1 items-center justify-center h-full mt-5">
            <ActivityIndicator size="large" color="#FF8C00" />
          </View>
        ) : categories.length === 0 ? (
          <View className="flex-1 items-center justify-center h-full mt-5">
            <Text className="text-lg text-gray-500">Chưa có sản phẩm</Text>
          </View>
        ) : (
          <FlatList
            className="mt-16"
            data={sectionData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        )}
      </View>

      <CheckoutBtn getProductName={getProductName} />
    </SafeAreaView>
  );
}
