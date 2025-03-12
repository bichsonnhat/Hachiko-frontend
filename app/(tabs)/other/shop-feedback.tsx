import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Linking,
  View,
  Text,
  Modal,
  TextInput,
} from "react-native";
import { Globe, Mail, Phone, NotebookPen } from "lucide-react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ShopFeedback() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Liên hệ và góp ý",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "white",
      },
    });
  }, [navigation]);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => alert("Không thể mở đường dẫn!"));
  };

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const handleCloseModal = () => {
    setFeedback("");
    setOpenModal(false);
  };

  const handleSendFeedback = () => {
    alert("Cảm ơn bạn đã gửi phản hồi!");
    handleCloseModal();
  };

  return (
    <>
      <View className="flex-1 p-1">
        <TouchableOpacity
          className="px-4 py-2 bg-white flex-row items-center border-b border-gray-200 gap-3"
          onPress={() => handleOpenLink("tel:19001068")}
        >
          <Phone size={22} color="black" />
          <View className="flex-col">
            <Text className="text-lg font-semibold text-gray-700">
              Tổng đài
            </Text>
            <Text className="text-base text-blue-500">19001068</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 bg-white flex-row items-center border-b border-gray-200 gap-3"
          onPress={() => handleOpenLink("mailto:hi@thehachikocoffee.vn")}
        >
          <Mail size={22} color="black" />
          <View className="flex-col">
            <Text className="text-lg text-gray-700 font-semibold">Email</Text>
            <Text className="text-base text-blue-500">
              hi@thehachikocoffee.vn
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 bg-white flex-row items-center border-b border-gray-200 gap-3"
          onPress={() => handleOpenLink("https://www.thehachikocoffee.com")}
        >
          <Globe size={22} color="black" />
          <View className="flex-col">
            <Text className="text-lg text-gray-700 font-semibold">Website</Text>
            <Text className="text-base text-blue-500">
              www.thehachikocoffee.com
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 pl-5 py-2 bg-white flex-row items-center border-b border-gray-200 gap-3"
          onPress={() =>
            handleOpenLink("https://facebook.com/TheCoffeeHouse2004")
          }
        >
          <FontAwesome name="facebook-square" size={22} color="black" />
          <View className="flex-col">
            <Text className="text-lg text-gray-700 font-semibold">
              Facebook
            </Text>
            <Text className="text-base text-blue-500">
              facebook.com/TheCoffeeHouse2004
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 bg-white flex-row items-center mt-4"
          onPress={() => setOpenModal(true)}
        >
          <NotebookPen size={22} color="black" />
          <Text className="ml-3 text-lg text-gray-700">
            Gửi góp ý về ứng dụng
          </Text>
          <Text className="ml-auto">{">"}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={openModal}
        transparent
        animationType="slide"
        className="flex-1 w-full h-full justify-center items-center"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-5 rounded-lg">
            <Text className="text-lg font-semibold text-center">
              Đối với Hachiko, mọi góp ý của bạn đều quý giá 💛
            </Text>
            <TextInput
              className="border border-gray-300 rounded-md mt-3 p-3 min-h-[200px] max-h-[400px] text-gray-700"
              placeholder="Chia sẻ cảm nghĩ của bạn về ứng dụng cho Hachiko tại đây"
              multiline
              value={feedback}
              onChangeText={setFeedback}
            />

            <TouchableOpacity
              className={`mt-4 p-3 rounded-lg ${
                feedback.trim() ? "bg-yellow-500" : "bg-gray-300"
              }`}
              disabled={!feedback.trim()}
              onPress={handleSendFeedback}
            >
              <Text className="text-white text-center font-semibold">
                Gửi phản hồi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-2" onPress={handleCloseModal}>
              <Text className="text-center text-gray-500">Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
