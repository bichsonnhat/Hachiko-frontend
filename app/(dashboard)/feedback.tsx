import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { Star } from "lucide-react-native";

const feedbacks = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    rating: 5,
    comment: "Dịch vụ tuyệt vời! Tôi rất hài lòng.",
    date: "14/03/2025",
  },
  {
    id: 2,
    name: "Trần Thị B",
    rating: 4,
    comment:
      "Nhân viên thái độ tốt, trà ngon, không gian yên tĩnh phù hợp cho học hành và giải toả căng thẳng.",
    date: "12/03/2025",
  },
  {
    id: 3,
    name: "Lê Văn C",
    rating: 3,
    comment: "Sản phẩm ổn nhưng giao hàng hơi lâu.",
    date: "10/03/2025",
  },
  {
    id: 4,
    name: "Lê Văn C",
    rating: 5,
    comment: `Ngày hôm đó, một buổi chiều mùa hè nắng nóng, tôi quyết định ghé qua quán nước “Trà Hạnh Phúc”. Tên quán đã khiến tôi tò mò và hy vọng rằng đây sẽ là nơi mang lại cho tôi những giây phút thư giãn. Đến quán, tôi bước vào một không gian yên tĩnh, nơi âm nhạc nhẹ nhàng từ loa phát ra. Nhân viên đang vui vẻ lau chùi bàn ghế, và họ chào đón tôi với nụ cười thân thiện. “Chào bạn! Bạn muốn gì?” Nhân viên hỏi. Tôi nhấn mạnh về trà, và họ giới thiệu cho tôi menu đa dạng với các loại trà từ truyền thống đến hiện đại. Tôi quyết định thử một ly trà hoa cúc và cam thảo. Ngồi xuống, tôi cảm nhận không gian thoải mái, với những bức tranh treo trên tường và những bông hoa tươi trên mỗi bàn. Chờ đợi, tôi nhận được ly trà thơm phức. Hương thảo quả và hoa cúc kết hợp tạo nên một hương vị độc đáo. Tôi thích cách họ chế biến trà, không quá ngọt và không quá đắng. Trong lúc thưởng thức trà, tôi cảm nhận sự yên bình và thư thái. Không gian này thực sự phù hợp cho việc học hành và giải toả căng thẳng. Vào lúc tôi rời khỏi quán, nhân viên lại đứng ở cửa chào tạm biệt: “Hẹn gặp lại bạn lần sau!” Với trải nghiệm tuyệt vời này, tôi quyết định sẽ trở lại “Trà Hạnh Phúc” thường xuyên.`,
    date: "10/03/2025",
  },
];

const emptyFeedbacks: {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}[] = [];

const DashboardFeedback = () => {
  const navigation = useNavigation();
  const [data] = useState(feedbacks);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đánh giá của khách hàng",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "white",
      },
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: (typeof feedbacks)[0] }) => (
    <View className="bg-gray-100 p-4 rounded-lg m-4">
      <Text className="font-semibold text-lg">{item.name}</Text>
      <View className="flex-row items-center mt-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={18}
            color={index < item.rating ? "#FFD700" : "#ccc"}
            fill={index < item.rating ? "#FFD700" : "none"}
          />
        ))}
      </View>
      <Text className="text-gray-700 mt-2">{item.comment}</Text>
      <Text className="text-gray-500 text-sm mt-1 italic">
        Ngày: {item.date}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center">
            Chưa có đánh giá nào. 😕
          </Text>
        }
      />
    </View>
  );
};

export default DashboardFeedback;
