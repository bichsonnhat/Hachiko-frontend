import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Star } from "lucide-react-native";
import { IOrderFeedback } from "@/constants";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";

const DashboardFeedback = () => {
  const navigation = useNavigation();
  const { errorMessage, callApi: callFeedbackApi } = useApi<void>();
  const [feedbacks, setFeedbacks] = useState<IOrderFeedback[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      await callFeedbackApi(async () => {
        const { data } = await apiService.get("/feedback");
        if (data) {
          setFeedbacks(data);
        }
      });
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đánh giá của khách hàng",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "white",
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (errorMessage) {
      console.error("❌ Lỗi khi lấy đánh giá:", errorMessage);
    }
  }, [errorMessage]);

  const renderItem = ({ item }: { item: (typeof feedbacks)[0] }) => (
    <View className="bg-gray-100 p-4 rounded-lg m-4">
      <Text className="font-semibold text-lg">{item.username}</Text>
      <View className="flex-row items-center mt-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={18}
            color={index < item.rating ? "#FFD700" : "#ccc"}
            fill={index < item.rating ? "#FFD700" : "none"}
          />
        ))}
      </View>
      <Text className="text-gray-500 text-sm mt-1 italic">
        Mã đơn: {item.orderId}
      </Text>
      <Text className="text-gray-700 mt-2">{item.feedbackContent}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={feedbacks}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center">
            Chưa có đánh giá nào. 😕
          </Text>
        }
      />
    </View>
  );
};

export default DashboardFeedback;
