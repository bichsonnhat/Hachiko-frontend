import {
  Category,
  CheckoutBtn,
  Collection,
  DrinkSlotHorizontal,
  Header,
} from "@/components/OrderScreen";
import { useEffect, useRef, useState } from "react";
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
import { useLocalSearchParams } from 'expo-router';

type SectionItem = {
  type: "collection" | "category";
  categoryId?: string;
  categoryName?: string;
  products?: any[];
};

const ITEM_HEIGHT_COLLECTION = 500;
const ITEM_HEIGHT_PRODUCT = 150;
const HEADER_HEIGHT = 40;

export default function OrderScreen() {
  // Get the voucher ID from route params
  const params = useLocalSearchParams();
  const voucherId = params.voucherId as string;

  const flatListRef = useRef<FlatList>(null);
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

  const scrollToCategory = (categoryId: string) => {
    console.log("Scrolling to category:", categoryId);
    const index = sectionData.findIndex(
      (item) => item.categoryId === categoryId
    );
    console.log("Index to scroll to:", index);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

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
  }, [categoryGroups, categories]);

  useEffect(() => {
    if (categoryErrorMessage) {
      console.error("❌ Lỗi khi lấy danh sách danh mục:", categoryErrorMessage);
    }
    if (productErrorMessage) {
      console.error("❌ Lỗi khi lấy danh sách sản phẩm:", productErrorMessage);
    }
  }, [categoryErrorMessage, productErrorMessage]);

  const SectionListItem = React.memo(({ item }: { item: SectionItem }) => {
    if (item.type === "collection") {
      return (
        <View className="mt-0">
          <Category
            categories={categories}
            loading={categoryLoading}
            scrollToCategory={scrollToCategory}
          />
          {/* <Collection /> */}
        </View>
      );
    }

    return (
      <View className="flex-col pb-4 border-b border-gray-100">
        <Text className="font-bold text-xl px-4 py-2">{item.categoryName}</Text>
        <View>
          {item.products?.map((drink, index) => (
            <View key={index} className="mb-3">
              <DrinkSlotHorizontal drink={drink} check={checkHasTopping} />
            </View>
          ))}
        </View>
      </View>
    );
  });

  const renderItem = ({ item }: ListRenderItemInfo<SectionItem>) => {
    return <SectionListItem item={item} />;
  };

  const keyExtractor = (item: SectionItem, index: number) => {
    if (item.type === "collection") return "collection";
    return `cat-${item.categoryId ?? index}`;
  };

  const getItemLayout = (
    data: ArrayLike<SectionItem> | null | undefined,
    index: number
  ) => {
    let offset = 0;

    for (let i = 0; i < index; i++) {
      const item = sectionData[i];

      if (item.type === "collection") {
        offset += ITEM_HEIGHT_COLLECTION;
      } else if (item.type === "category" && item.products) {
        offset += HEADER_HEIGHT + item.products.length * ITEM_HEIGHT_PRODUCT;
      }
    }

    const currentItem = sectionData[index];
    let length = ITEM_HEIGHT_COLLECTION;

    if (currentItem?.type === "category" && currentItem.products) {
      length =
        HEADER_HEIGHT + currentItem.products.length * ITEM_HEIGHT_PRODUCT;
    }

    return { length, offset, index };
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />

      <View className="flex-1 bg-white">
        {productLoading ? (
          <View className="flex-1 items-center justify-center h-full">
            <ActivityIndicator size="large" color="#FF8C00" />
          </View>
        ) : categories.length === 0 ? (
          <View className="flex-1 items-center justify-center h-full">
            <Text className="text-lg text-gray-500">Chưa có sản phẩm</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={sectionData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={5}
            contentContainerStyle={{ paddingTop: 0, paddingBottom: 80 }}
            removeClippedSubviews
          />
        )}
      </View>

      <CheckoutBtn getProductName={getProductName} voucherId={voucherId} />
    </SafeAreaView>
  );
}
