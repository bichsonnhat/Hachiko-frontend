import {
  Category,
  CheckoutBtn,
  Collection,
  Drinks,
  Header,
} from "@/components/OrderScreen";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Text,
  SafeAreaView,
} from "react-native";
import { CategoryFromAPI, CategoryGroup, DrinkPropertie, ProductFromAPI } from "@/constants/app.interface";
import apiService from "@/constants/config/axiosConfig";
import React from "react";

export default function OrderScreen() {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [categories, setCategories] = useState<CategoryFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionsRef: { [key: string]: React.RefObject<View> } = {};

  const categoryOrder = [
    "Món mới phải thử",
    "Cà phê",
    "Trà Trái Cây",
    "Trà Sữa Macchiato",
    "Trà Xanh Tây Bắc",
    "Đá Xay Frosty",
    "CloudFee",
    "Bánh Ngọt",
    "Bánh Mặn",
    "Cafe Tại Nhà",
    "Chai Fresh Không Đá",
    "Các Loại Đồ Ăn Khác",
    "Topping",
  ];

  const handleScroll = (categoryId: string) => {
    const section = sectionsRef[categoryId]?.current;
    const scrollView = scrollViewRef.current;
    if (section && scrollView) {
      section.measure((x, y, width, height, pageX, pageY) => {
        scrollView.scrollTo({ y: pageY - 32, animated: true });
      });
    }
  };

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [categoriesResponse, productsResponse] = await Promise.all([
        apiService.get<CategoryFromAPI[]>('/categories'),
        apiService.get<CategoryGroup[]>('/products/grouped-by-category')
      ]);

      setCategories(categoriesResponse.data);

      const sortedGroups = productsResponse.data.sort((a, b) => {
        const aCategory = categoriesResponse.data.find(c => c.id === a._id);
        const bCategory = categoriesResponse.data.find(c => c.id === b._id);
        return categoryOrder.indexOf(aCategory?.name || '') - categoryOrder.indexOf(bCategory?.name || '');
      });

      setCategoryGroups(sortedGroups);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : `Danh mục ${categoryId}`;
  };


  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="absolute top-0 left-0 right-0 z-10 bg-white">
          <Header />
        </View>
        <ScrollView className="mt-16" ref={scrollViewRef}>
          <View className="mt-4">
            <Category
              handleScroll={(categoryId) => handleScroll(categoryId)}
            />
          </View>
          <Collection />
          {categoryGroups.map((group) => {
            const categoryId = group._id.toString();
            const categoryName = getCategoryName(group._id);

            return (
              <View key={categoryId} ref={sectionsRef[categoryId]}>
                <Drinks title={categoryName} drinks={group.products} />
              </View>
            );
          })}
        </ScrollView>
      </View>
      <CheckoutBtn />
    </SafeAreaView>
  );
}
