import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { DateSelection, PendingOrders } from "@/components/DashboardScreen";

const DashboardPendingOrder = () => {
  const navigation = useNavigation();
  const [timePeriod, setTimePeriod] = useState<number | null>(null);

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

  useEffect(() => {
    console.log("call api search order with timePeriod", timePeriod);
  }, [timePeriod]);

  return (
    <View>
      <DateSelection setTimePeriod={setTimePeriod} />
      <PendingOrders />
    </View>
  );
};

export default DashboardPendingOrder;
