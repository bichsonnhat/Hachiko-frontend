import { Phone, Mail, Globe, Facebook, MessageSquare, ChevronRight } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, FlatList, Linking } from "react-native";

export default function ContactFeedback() {
  const data = [
    {
      id: "1",
      icon: <Phone size={24} color="black" />,
      title: "Tổng đài",
      value: "19001068",
      // onPress: () => 
    },
    {
      id: "2",
      icon: <Mail size={24} color="black" />,
      title: "Email",
      value: "hi@thehachikocoffee.vn",
      // onPress: () => 
    },
    {
      id: "3",
      icon: <Globe size={24} color="black" />,
      title: "Website",
      value: "www.thehachikocoffee.com",
      // onPress: () => 
    },
    {
      id: "4",
      icon: <Facebook size={24} color="black" />,
      title: "Facebook",
      value: "facebook.com/TheCoffeeHouse2004",
      // onPress: () =>
    },
    {
      id: "5",
      icon: <MessageSquare size={24} color="black" />,
      title: "Gửi góp ý về ứng dụng",
      value: "",
      // onPress: () => 
    },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={item.onPress}
      className={`flex-row items-center py-[15px] ${item.id !== "5" ? "border-b border-b-[#ddd]" : "py-[20px]"}`}
    >
      <View className="w-[30px] items-center">{item.icon}</View>
      <View className="flex-1 ml-[10px]">
        <Text className="font-bold text-[16px]">{item.title}</Text>
        {item.value ? (
          <Text className="text-[#555] text-[14px]">{item.value}</Text>
        ) : null}
      </View>
      {item.id === "5" && <ChevronRight size={20} color="black" />}
    </TouchableOpacity>
  );

  return (
    <View className=" bg-white px-[20px] mt-[15px]">
      <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
}