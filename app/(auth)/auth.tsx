import { useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import * as WebBrowser from 'expo-web-browser'
import SocialLoginButton from "@/components/SocialLoginButton";
import { Redirect, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex flex-col h-screen bg-white">
      <Image source={require('@/assets/images/auth/Hachiko.png')} className="w-full h-2/5" />
      <View className="absolute gap-4 bottom-0 w-full h-2/3 bg-white rounded-t-3xl flex items-center">
        <Text className="text-md mt-10">Chào mừng bạn đến với</Text>
        <Text style={{ fontFamily: 'BaronNeueBlack' }} className="text-3xl">THE HACHIKO COFFEE</Text>
        <View className="w-3/4 gap-5">
          <Text className="text-gray-500 text-center">Đăng nhập bằng</Text>

          {/* Apple */}
          <View className="rounded-lg overflow-hidden">
            <SocialLoginButton strategy="apple" />
          </View>

          {/* Facebook */}
          <View className="rounded-lg overflow-hidden">
            <SocialLoginButton strategy="facebook" />
          </View>

          {/* Google */}
          <View className="rounded-lg overflow-hidden">
            <SocialLoginButton strategy="google" />
          </View>

          <Text className="text-center mt-5">Tiếng Việt</Text>
        </View>
      </View>
    </View>
  );
}