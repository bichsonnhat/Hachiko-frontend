import { Header } from "@/components/OtherScreen";
import { SignedOut, useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  FileText,
  Star,
  MessageCircle,
  User,
  MapPinHouseIcon,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function OtherScreen() {
  const router = useRouter();
  const { signOut, user } = useClerk();
  
  function handleSignOut() {
    signOut();
  }

  return (
    <View className="flex h-full">
      <Header userId={user?.id ?? ""} />
      <ScrollView className="flex-1 p-4 h-full">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Tiện ích
        </Text>
        <View className="grid grid-cols-2 gap-3">
          <TouchableOpacity
            className="p-4 bg-white rounded-lg flex-row items-center gap-2 shadow-sm justify-between"
            onPress={() => router.push("/other/order-history")}
          >
            <View className="flex-row items-center gap-2">
              <FileText size={20} color="orange" />
              <Text className="text-gray-700">Lịch sử đặt hàng</Text>
            </View>
            <ChevronRight size={15} color="black" />
          </TouchableOpacity>
        </View>
        <Text className="text-lg font-semibold text-gray-700 mt-6 mb-2">
          Hỗ trợ
        </Text>
        <View className="bg-white rounded-lg shadow-sm">
          <TouchableOpacity
            className="p-4 flex-row items-center border-b border-gray-200 justify-between"
            onPress={() => router.push("/other/order-feedback")}
          >
            <View className="flex-row items-center gap-2">
              <Star size={20} color="black" />
              <Text className="ml-2 text-gray-700">Đánh giá đơn hàng</Text>
            </View>
            <ChevronRight size={15} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 flex-row items-center border-b border-gray-200 justify-between"
            onPress={() => router.push("/other/shop-feedback")}
          >
            <View className="flex-row items-center gap-2">
              <MessageCircle size={20} color="black" />
              <Text className="ml-2 text-gray-700">Liên hệ và góp ý</Text>
            </View>
            <ChevronRight size={15} color="black" />
          </TouchableOpacity>
        </View>

        {/* @h0angpc add routing for code below */}
        <Text className="text-lg font-semibold text-gray-700 mt-6 mb-2">
          Tài khoản
        </Text>
        <View className="bg-white rounded-lg shadow-sm">
          <TouchableOpacity className="p-4 flex-row items-center border-b border-gray-200 justify-between"
            onPress={() => router.push("/other/update-info")}>
            <View className="flex-row items-center gap-2">
              <User size={20} color="black" />
              <Text className="ml-2 text-gray-700">Thông tin cá nhân</Text>
            </View>
            <ChevronRight size={15} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut} className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <LogOut size={20} color="black" />
              <Text className="ml-2 text-gray-700">Đăng xuất</Text>
            </View>
            <ChevronRight size={15} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
