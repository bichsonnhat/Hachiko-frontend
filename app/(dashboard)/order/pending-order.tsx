import { View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { DateSelection, PendingOrders } from "@/components/DashboardScreen";
import { IOrder, OrderStatus } from "@/constants";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import { useBoolean } from "@/hooks/useBoolean";

const DashboardPendingOrder = () => {
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
      headerTitle: "Đơn hàng đang chờ",
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
            orderStatus: OrderStatus.PENDING,
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
      <PendingOrders orders={orders} toggleOrderChanged={orderChangedToggle} />
    </View>
  );
};

export default DashboardPendingOrder;
