import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function OrderFeedback() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đánh giá đơn hàng",
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
      <ThemedText>Đánh giá đơn hàng</ThemedText>
    </ThemedView>
  );
}
