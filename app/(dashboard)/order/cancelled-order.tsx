import { View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { CancelledOrders, DateSelection } from "@/components/DashboardScreen";
import { useApi } from "@/hooks/useApi";
import { IOrder, OrderStatus } from "@/constants";
import apiService from "@/constants/config/axiosConfig";
import { useBoolean } from "@/hooks/useBoolean";

const DashboardCancelledOrder = () => {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState<number>(
    new Date(2025, 0).getTime()
  );
  const [endDate, setEndDate] = useState<number>(new Date().getTime());
  const { errorMessage, callApi: callStatisticApi } = useApi<void>();
  const [orders, setOrders] = useState<IOrder[] | null>(null);
  const { value: isOrderChanged, toggle: orderChangedToggle } =
    useBoolean(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đơn hàng đã hủy",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "white",
      },
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        await callStatisticApi(async () => {
          const queryString = new URLSearchParams({
            orderStatus: OrderStatus.CANCELLED,
            startDate: startDate.toString(),
            endDate: endDate.toString(),
          });
          const url = `/statistic/order?${queryString}`;
          const { data } = await apiService.get(url);
          if (data && isActive) {
            setOrders(data);
          }
        });
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [isOrderChanged, startDate, endDate])
  );

  useEffect(() => {
    if (errorMessage) {
      console.error("❌ Lỗi khi lấy thông tin thống kê:", errorMessage);
    }
  }, [errorMessage]);

  return (
    <View className="flex-1">
      <DateSelection
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <CancelledOrders
        orders={orders}
        toggleOrderChanged={orderChangedToggle}
      />
    </View>
  );
};

export default DashboardCancelledOrder;
