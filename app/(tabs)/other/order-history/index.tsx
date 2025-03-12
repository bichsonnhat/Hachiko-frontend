import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  CancelledOrders,
  CompletedOrders,
  PendingOrders,
} from "@/components/OtherScreen";

export default function OrderHistory() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "pending", title: "Đang chờ" },
    { key: "completed", title: "Đã hoàn tất" },
    { key: "cancelled", title: "Đã hủy" },
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Lịch sử đặt hàng",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "white",
      },
    });
  }, [navigation]);

  const renderScene = SceneMap({
    pending: PendingOrders,
    completed: CompletedOrders,
    cancelled: CancelledOrders,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "orange", height: 3 }}
          style={{ backgroundColor: "white", elevation: 0, shadowOpacity: 0 }}
          activeColor="orange"
          inactiveColor="gray"
        />
      )}
    />
  );
}
