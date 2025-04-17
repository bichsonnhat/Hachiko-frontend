import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function PaymentLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="failed" />
        <Stack.Screen name="success" />
      </Stack>
    </GestureHandlerRootView>
  );
}
