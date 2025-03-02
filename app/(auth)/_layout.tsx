import { Stack } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function SignInLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-white">
        <Stack screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="phone-auth" />
      </Stack>
    </GestureHandlerRootView>
  );
}
