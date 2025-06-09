import { ThemedView } from "@/components/ThemedView";
import {
  LogOut,
  Folder,
  Store,
  Package,
  ChevronRight,
  User,
  Bell,
  Ticket,
  MessageSquareHeart,
} from "lucide-react-native";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useClerk } from "@clerk/clerk-expo";
import { twMerge } from "tailwind-merge";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import { IStatistic } from "@/constants";

type GridProps = {
  id: string;
  title: string;
  value: number;
  color: string;
  route: string;
  isRevenue: boolean;
};

// Add this after the existing data array
const tools = [
  {
    id: "1",
    title: "Quản lí danh mục",
    icon: Folder,
    route: "/category",
  },
  {
    id: "2",
    title: "Quản lí cửa hàng",
    icon: Store,
    route: "/store",
  },
  {
    id: "3",
    title: "Quản lí sản phẩm",
    icon: Package,
    route: "/product",
  },
  {
    id: "4",
    title: "Quản lí voucher",
    icon: Ticket,
    route: "/voucher",
  },
  {
    id: "5",
    title: "Quản lí thông báo",
    icon: Bell,
    route: "/notification",
  },
  {
    id: "6",
    title: "Quản lí quảng cáo",
    icon: Bell,
    route: "/advertisement",
  },
  {
    id: "7",
    title: "Quản lí người dùng",
    icon: User,
    route: "/user",
  },
];

// Calculate item width based on screen width
const { width } = Dimensions.get("window");
const numColumns = 2;
const spacing = 16;
const cardWidth = (width - spacing * (numColumns + 1)) / numColumns;

export default function Dashboard() {
  const { signOut } = useClerk();
  const { errorMessage, callApi: callStatisticApi } = useApi<void>();

  function handleSignOut() {
    signOut();
    router.replace("/auth");
  }

  const [grids, setGrids] = useState<GridProps[]>([
    {
      id: "1",
      title: "Đơn hàng đã xác nhận",
      value: 0,
      color: "bg-green-500",
      route: "/order/successful-order",
      isRevenue: false,
    },
    {
      id: "2",
      title: "Đơn hàng đã hủy",
      value: 0,
      color: "bg-red-500",
      route: "/order/cancelled-order",
      isRevenue: false,
    },
    {
      id: "3",
      title: "Đơn hàng đang chờ",
      value: 0,
      color: "bg-yellow-500",
      route: "/order/pending-order",
      isRevenue: false,
    },
    {
      id: "4",
      title: "Thống kê doanh thu",
      value: 0,
      color: "bg-blue-500",
      route: "/order",
      isRevenue: true,
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        await callStatisticApi(async () => {
          const url = "/statistic";
          const { data } = await apiService.get<IStatistic>(url);
          if (data && isActive) {
            setGrids((prev) => [
              { ...prev[0], value: data.numberOfCompletedOrders },
              { ...prev[1], value: data.numberOfCancelledOrders },
              { ...prev[2], value: data.numberOfPendingOrders },
              { ...prev[3], value: data.totalRevenue },
            ]);
          }
        });
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const Card = ({ item }: { item: any }) => (
    <View
      style={[styles.card]}
      className={twMerge(item.color, "rounded-xl justify-between")}
    >
      <Text className="text-white font-medium text-2xl">{item.title}</Text>
      <Text className="text-white font-bold text-2xl">
        {item.value.toLocaleString("vi-VN")}
        {item.isRevenue ? "đ" : ""}
      </Text>
    </View>
  );

  const GridView = () => (
    <View style={styles.container}>
      <View style={styles.row}>
        {grids.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => router.push(`/(dashboard)/${item.route}`)}
          >
            <Card item={item} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  useEffect(() => {
    if (errorMessage) {
      console.error("❌ Lỗi khi lấy thông tin thống kê:", errorMessage);
    }
  }, [errorMessage]);

  return (
    <SafeAreaView className="flex-1 bg-white h-full">
      {/* Header */}
      <View className="flex flex-row justify-between px-4 mb-4">
        <Text className="text-2xl font-bold mt-4">Dashboard</Text>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.push("/feedback")}>
            <View className="px-3 py-[10px] gap-2 mt-3 bg-[#FFA523] rounded-full flex-row items-center justify-center shadow-md shadow-slate-600">
              <MessageSquareHeart size={22} color="white" className="mr-2" />
              <Text className="font-semibold text-white text-base">
                Feedback
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignOut}>
            <ThemedView
              className={`w-12 h-12 mt-3 bg-white rounded-full flex items-center justify-center shadow-md shadow-slate-600`}
            >
              <LogOut size={20} color="black" />
            </ThemedView>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <GridView />

        <View className="mt-1 px-4 mb-2">
          <Text className="text-2xl font-bold">Tools</Text>
        </View>
        {/* Tools List */}
        <View
          className="border mx-4 rounded-xl mb-4"
          style={{ borderColor: "#f59e0b" }}
        >
          {tools.map((tool, index) => (
            <TouchableOpacity
              key={tool.id}
              className={twMerge(
                "flex-row rounded-xl items-center justify-between bg-white p-4",
                index !== tools.length - 1 && "border-b border-gray-200"
              )}
              onPress={() => router.push(`/(dashboard)/${tool.route}`)}
            >
              <View className="flex-row items-center">
                {/* Icon với nền tròn */}
                <View className="w-10 h-10 bg-[#FEF7E5] rounded-full flex items-center justify-center">
                  {tool.icon && <tool.icon size={24} color="#f59e0b" />}
                </View>
                <Text className="ml-4 font-medium text-black">
                  {tool.title}
                </Text>
              </View>
              <ChevronRight size={24} color="black" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing,
  },
  card: {
    width: cardWidth,
    height: cardWidth,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
