import React from "react";
import { Stack } from "expo-router";

const OrderLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="order-feedback" />
      <Stack.Screen name="order-history" />
      <Stack.Screen name="shop-feedback" />
    </Stack>
  );
};

export default OrderLayout;
