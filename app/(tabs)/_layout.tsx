import { Redirect, Tabs, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@clerk/clerk-expo";
import { useUser } from "@clerk/clerk-expo";
import apiService from "@/constants/config/axiosConfig";

// Define valid redirect paths
type RedirectPath = "/auth" | "/dashboard" | "/update-information" | null;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const page = segments[segments.length - 1];
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [isRedirectUpdateInfo, setIsRedirectUpdateInfo] = useState(false);
  const [hasCheckedPhone, setHasCheckedPhone] = useState(false);
  const [redirectPath, setRedirectPath] = useState<RedirectPath>(null);

  // Check if we're already on the update-info page to prevent redirect loop
  const isInOtherTab =
    segments.length >= 2 &&
    segments[0] === "(tabs)" &&
    segments[1] === "other";

  const isOnUpdateInformation =
    segments.length === 1 && segments[0] === "update-information";

  // Handle auth check
  useEffect(() => {
    if (!isSignedIn) {
      setRedirectPath("/auth");
    }
  }, [isSignedIn]);

  // Get user data
  useEffect(() => {
    if (!userId || !isSignedIn) return;
    
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get(`/users/${userId}`);
        const userData = response.data;
        
        if (userData.isAdmin === true) {
          setIsAdmin(true);
          setRedirectPath("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [userId, isSignedIn]);

  // Check phone number and redirect if needed
  useEffect(() => {
    if (isSignedIn && user && !hasCheckedPhone) {
      const checkRedirect = async () => {
        try {
          const response = await apiService.get(`/users/${user.id}`);
          const userData = response.data;

          if (
            (!userData.phoneNumber || userData.phoneNumber.trim() === "") &&
            !isInOtherTab &&
            !isOnUpdateInformation
          ) {
            setIsRedirectUpdateInfo(true);
            setRedirectPath("/update-information");
          }

          setHasCheckedPhone(true);
        } catch (error) {
          console.error("Error checking redirect metadata:", error);
          setHasCheckedPhone(true);
        }
      };

      checkRedirect();
    }
  }, [isSignedIn, user, isInOtherTab, isOnUpdateInformation, hasCheckedPhone]);

  // Handle redirects
  if (redirectPath) {
    return <Redirect href={redirectPath} />;
  }

  const pageToHideTabBar = [
    "order-feedback",
    "shop-feedback",
    "order-history",
    "update-info",
    "add-address",
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
