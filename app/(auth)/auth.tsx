import { useEffect, useRef, useState } from "react";
import { View, Text, Image, TextInput, Button, TouchableOpacity,  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from 'expo-web-browser'
import SocialLoginButton from "@/components/SocialLoginButton";
import { useRouter } from "expo-router";

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(false);

  const validateVietnamesePhone = (phone: string) => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    const vietnamesePhoneRegex = /^(0[3-9][0-9]{8}|03[2-9][0-9]{7})$/;
    return vietnamesePhoneRegex.test(cleanPhone);
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    setIsValidPhone(validateVietnamesePhone(text));
  };

  return (
    <View className="flex flex-col h-screen bg-white">
        <Image source={require('@/assets/images/auth/Hachiko.png')} className="w-full h-2/5" />
        <View className="absolute gap-4 bottom-0 w-full h-2/3 bg-white rounded-t-3xl flex items-center">
          <Text className="text-md mt-10">Chào mừng bạn đến với</Text>
          <Text style={{fontFamily: 'BaronNeueBlack'}} className="text-3xl">THE HACHIKO COFFEE</Text>
          <View className="w-3/4 gap-5">
          <View className="flex flex-row items-center gap-2">
            <View className="flex flex-row w-full border border-gray-300 rounded-lg overflow-hidden">
              <View className="bg-gray-100 px-3 flex flex-row gap-2 items-center justify-center border-r border-gray-300">
                <Image source={require('@/assets/images/auth/vietnam.png')} className="size-5" />
                <Text className="text-black">+84</Text>
              </View>
              {/* Check if phone number is valid Vietnamese phone number */}
              <TextInput
                placeholder="Nhập số điện thoại"
                className="flex-1 h-12 p-2"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
              />
            </View>
          </View>

          {/* Login Button */}
          <View className="rounded-lg overflow-hidden">
            <TouchableOpacity
              disabled={!isValidPhone}
              style={{
                backgroundColor: isValidPhone ? '#E47905' : '#E4790550'
              }}
              className="py-3 rounded-lg"
                onPress={() => router.push({
                  pathname: '/phone-auth',
                  params: { phoneNumber }
                })}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-medium text-base">
                Đăng nhập
              </Text>
            </TouchableOpacity>

          </View>
          <View className="flex flex-row items-center gap-2">
            <View className="flex-1 border-t border-gray-300" />
            <Text className="text-gray-500">hoặc tiếp tục bằng</Text>
            <View className="flex-1 border-t border-gray-300" />
          </View>

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
          
          {/* <TouchableOpacity 
            className="bg-black py-3 rounded-lg flex flex-row items-center justify-center gap-2"
            onPress={() => {}}
            disabled={false}
          >
              <Text className="text-white text-center font-medium text-base">
                  Đăng ký
              </Text>
          </TouchableOpacity> */}

          <Text className="text-center mt-5">Tiếng Việt</Text>
          </View>
        </View>
    </View>
  );
}