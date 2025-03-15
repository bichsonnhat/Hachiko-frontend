import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";

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

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [500, 1200, 800, 1800, 2200, 1900],
      },
    ],
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [timePeriod, setTimePeriod] = useState<number | null>(null);

  const bestSellingProducts = [
    {
      id: 1,
      image: require("@/assets/images/Products/tra-xanh-nong.jpg"),
      name: "test truncate Sản phẩm A Sản phẩm A Sản phẩm A Sản phẩm A Sản phẩm A Sản phẩm A",
      quantitySold: 120,
    },
    {
      id: 2,
      image: require("@/assets/images/Products/tra-xanh-nong.jpg"),
      name: "test truncate Sản phẩm B Sản phẩm B Sản phẩm B Sản phẩm B Sản phẩm B Sản phẩm B",
      quantitySold: 95,
    },
    {
      id: 3,
      image: require("@/assets/images/Products/tra-xanh-nong.jpg"),
      name: "test truncate Sản phẩm C Sản phẩm C Sản phẩm C Sản phẩm C Sản phẩm C Sản phẩm C",
      quantitySold: 80,
    },
    {
      id: 4,
      image: require("@/assets/images/Products/tra-xanh-nong.jpg"),
      name: "test truncate Sản phẩm D Sản phẩm D Sản phẩm D Sản phẩm D Sản phẩm D Sản phẩm D",
      quantitySold: 75,
    },
    {
      id: 5,
      image: require("@/assets/images/Products/tra-xanh-nong.jpg"),
      name: "Sản phẩm E",
      quantitySold: 60,
    },
  ];

  useEffect(() => {
    console.log("call API search order with timePeriod", timePeriod);
  }, [timePeriod]);

  useEffect(() => {
    const timePeriod = endDate.getTime() - startDate.getTime();
    setTimePeriod(timePeriod);
  }, [startDate, endDate]);

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

        <LineChart
          data={revenueData}
          width={screenWidth - 26}
          height={300}
          chartConfig={{
            backgroundGradientFrom: "#f3f4f6",
            backgroundGradientTo: "#e5e7eb",
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2,
          }}
          bezier
          style={{ borderRadius: 8, marginVertical: 8 }}
        />

        <Text className="text-xl font-bold">Sản phẩm bán chạy nhất:</Text>
        <View className="bg-gray-200 rounded-lg mt-3">
          <View className="flex-row items-center p-3 bg-gray-300 rounded-t-lg">
            <Text className="flex-1 text-center font-bold">Hình ảnh</Text>
            <Text className="flex-1 text-center font-bold">Tên</Text>
            <Text className="flex-1 text-center font-bold">Đã bán</Text>
          </View>

          {bestSellingProducts.map((product, index) => (
            <View
              key={product.id}
              className={`flex-row items-center p-3 ${
                index !== bestSellingProducts.length - 1
                  ? "border-b border-gray-300"
                  : ""
              }`}
            >
              <Image
                source={product.image}
                className="w-16 h-16 rounded-md flex-1 text-center"
                style={{ resizeMode: "contain" }}
              />
              <Text
                className="flex-1 text-center"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {product.name}
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
