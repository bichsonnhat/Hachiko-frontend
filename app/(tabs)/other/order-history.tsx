import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function OrderHistory() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Lịch sử đơn hàng",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        borderBottomWidth: 10,
        borderBottomColor: "#000000",
        backgroundColor: "white",
      },
    });
  }, [navigation]);
  return (
    <ThemedView>
      <ThemedText>Lịch sử đơn hàng</ThemedText>
    </ThemedView>
  );
}
