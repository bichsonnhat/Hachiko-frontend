import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function DashboardLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="feedback" options={{ headerShown: true }} />
        <Stack.Screen name="order" />
      </Stack>
    </GestureHandlerRootView>
  );
}
