import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";

export default function PaymentWebScreen() {
  const safeHeight = StatusBar.currentHeight || 0;

  const { checkoutUrl } = useLocalSearchParams();

  if (!checkoutUrl) return null;

  return (
    <SafeAreaView style={{ flex: 1, marginTop: safeHeight }}>
      <WebView source={{ uri: String(checkoutUrl) }} style={{ flex: 1 }} />
    </SafeAreaView>
  );
}
