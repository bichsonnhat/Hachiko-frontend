import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function ShopFeedback() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Liên hệ và góp ý",
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
      <ThemedText>Liên hệ và góp ý</ThemedText>
    </ThemedView>
  );
}
