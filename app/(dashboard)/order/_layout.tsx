import React from "react";
import { Stack } from "expo-router";

const OrderLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="pending-order" />
      <Stack.Screen name="cancelled-order" />
      <Stack.Screen name="successful-order" />
    </Stack>
  );
};

export default OrderLayout;
