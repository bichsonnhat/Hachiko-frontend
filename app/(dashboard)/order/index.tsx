import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IProductStatistic, IRevenueStatistic } from "@/constants";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";

type RevenueDataProps = {
  labels: string[];
  datasets: {
    data: number[];
  }[];
};

const DashboardChart = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Thống kê",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "white",
      },
    });
  }, [navigation]);

  const [revenueData, setRevenueData] = useState<RevenueDataProps>({
    labels: ["2025-01"],
    datasets: [
      {
        data: [0],
      },
    ],
  });

  const [startDate, setStartDate] = useState<Date>(new Date(2025, 0));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [bestSellingProducts, setBestSellingProducts] = useState<
    IProductStatistic[]
  >([]);
  const { errorMessage, callApi: callStatisticApi } = useApi<void>();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        await callStatisticApi(async () => {
          const queryString = new URLSearchParams({
            startDate: startDate.getTime().toString(),
            endDate: endDate.getTime().toString(),
          });
          const url = `/statistic/revenue?${queryString}`;
          const { data } = await apiService.get<IRevenueStatistic>(url);
          if (data && isActive) {
            setRevenueData({
              labels: data.labels,
              datasets: [
                {
                  data: data.data,
                },
              ],
            });
          }
        });
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [startDate, endDate])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        await callStatisticApi(async () => {
          const url = `/statistic/popular-products`;
          const { data } = await apiService.get(url);
          if (data && isActive) {
            setBestSellingProducts(data);
          }
        });
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (errorMessage) {
      console.error("❌ Lỗi khi lấy thông tin thống kê:", errorMessage);
    }
  }, [errorMessage]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="w-full justify-between flex-row items-center">
          <Text className="text-xl font-bold">Tổng doanh thu:</Text>
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <Text className="text-blue-600 font-semibold text-lg">
                {startDate.toLocaleDateString("vi-VN")}
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-600 font-semibold text-lg px-2">-</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Text className="text-blue-600 font-semibold text-lg">
                {endDate.toLocaleDateString("vi-VN")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LineChart
            data={revenueData}
            width={screenWidth - 26}
            height={300}
            chartConfig={{
              backgroundGradientFrom: "#f3f4f6",
              backgroundGradientTo: "#e5e7eb",
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 4,
            }}
            bezier
            style={{
              borderRadius: 8,
              margin: 4,
              padding: 4,
            }}
          />
        </View>

        <Text className="text-xl font-bold">5 sản phẩm bán chạy nhất:</Text>
        <View className="bg-gray-200 rounded-lg mt-3">
          <View className="flex-row items-center p-3 bg-gray-300 rounded-t-lg">
            <Text className="flex-1 text-center font-bold">Hình ảnh</Text>
            <Text className="flex-1 text-center font-bold">Tên</Text>
            <Text className="flex-1 text-center font-bold">Đã bán</Text>
          </View>

          {bestSellingProducts.map((product, index) => (
            <View
              key={product.productId}
              className={`flex-row items-center p-3 ${
                index !== bestSellingProducts.length - 1
                  ? "border-b border-gray-300"
                  : ""
              }`}
            >
              <Image
                source={{ uri: product.productImage }}
                className="w-16 h-16 rounded-md flex-1 text-center"
                style={{ resizeMode: "contain" }}
              />
              <Text
                className="flex-1 text-center"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {product.productName}
              </Text>

              <Text className="flex-1 text-center">{product.quantitySold}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}
    </View>
  );
};

export default DashboardChart;
