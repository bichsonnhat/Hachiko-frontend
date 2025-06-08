import { Redirect, Tabs, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth, useUser } from "@clerk/clerk-expo";
import apiService from "@/constants/config/axiosConfig";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segment = useSegments();
  const page = segment[segment.length - 1];
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isRedirectUpdateInfo, setIsRedirectUpdateInfo] = useState(false);

  useEffect(() => {
    // Check if user needs to be redirected (only for signed-in users)
    if (isSignedIn && user) {
      const checkRedirect = async () => {
        try {
          // Check if the user has a redirect URL in their metadata
          const response = await apiService.get(`/users/${user.id}`);
          const userData = response.data;
          
          if (userData.phoneNumber === null) {
            // Redirect the user
            setIsRedirectUpdateInfo(true);
          }
        } catch (error) {
          console.error("Error checking redirect metadata:", error);
        }
      };
      
      checkRedirect();
    } else {
      setIsRedirectUpdateInfo(false);
    }
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return <Redirect href="/auth" />;
  }

  // If we're still checking for redirects, don't render the tabs yet
  if (isRedirectUpdateInfo) {
    return <Redirect href="/(tabs)/other/update-info" />;
  }

  // return <Redirect href="/cloudinary-example" />

  const pageToHideTabBar = [
    "order-feedback",
    "shop-feedback",
    "order-history",
    "update-info",
    "add-address",
    "saved-address",
    "[id]",
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          height: 60,
          display: pageToHideTabBar.includes(page) ? "none" : "flex",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Đặt hàng",
          tabBarIcon: ({ color }) => (
            <Feather name="coffee" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Cửa hàng",
          tabBarIcon: ({ color }) => (
            <Entypo name="shop" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="coupon"
        options={{
          title: "Ưu đãi",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="discount" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="other"
        options={{
          title: "Khác",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="reorder" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
