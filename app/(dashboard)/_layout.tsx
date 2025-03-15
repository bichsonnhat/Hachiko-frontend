import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function DashboardLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-white">
        <Stack screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
}
