import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { DateSelection, SuccessfulOrders } from "@/components/DashboardScreen";

const DashboardSuccessfulOrder = () => {
  const navigation = useNavigation();
  const [timePeriod, setTimePeriod] = useState<number | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đơn hàng đã xác nhận",
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
      <SuccessfulOrders />
    </View>
  );
};

export default DashboardSuccessfulOrder;
