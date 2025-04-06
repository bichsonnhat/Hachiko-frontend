import React from "react";
import { Stack } from "expo-router";

const OtherLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="order-feedback" />
      <Stack.Screen name="order-history" options={{ headerShown: false }} />
      <Stack.Screen name="shop-feedback" />
      <Stack.Screen name="update-info" />
      <Stack.Screen name="saved-address" />
      <Stack.Screen name="add-address" />
    </Stack>
  );
};

export default OtherLayout;
