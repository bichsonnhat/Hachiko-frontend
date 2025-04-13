import {
  Category,
  CheckoutBtn,
  Collection,
  Drinks,
  Header,
} from "@/components/OrderScreen";
import { useRef } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Text,
  SafeAreaView,
} from "react-native";

export default function OrderScreen() {
  const drinkProps = [
    {
      drink_img: require("@/assets/images/Products/tra-sua-o-long.png"),
      drink_name: "Trà sữa trân châu trắng - Truyền thống - Đá xay nhuyễn",
      drink_price: 25000,
      drink_description: "Mua đi bạn, ngon vc, xem miêu tả làm c gì?",
    },
    {
      drink_img: require("@/assets/images/Products/ca-phe-goi.jpg"),
      drink_name: "Cà phê gói - Đen - Đá xay nhuyễn",
      drink_price: 15000,
      drink_description: "Mua đi bạn, ngon vc, xem miêu tả làm c gì?",
    },
    {
      drink_img: require("@/assets/images/Products/thung-ca-phe.jpg"),
      drink_name: "Thùng cà phê - Đen - Đá xay nhuyễn",
      drink_price: 260000,
      drink_description: "Mua đi bạn, ngon vc, xem miêu tả làm c gì?",
    },
    {
      drink_img: require("@/assets/images/Products/tra-xanh-nong.jpg"),
      drink_name: "Trà xanh nóng - Uống phỏng lưỡi",
      drink_price: 2000,
      drink_description: "Mua đi bạn, ngon vc, xem miêu tả làm c gì?",
    },
  ];

  const categories = [
    "Món mới",
    // "Trà trái cây",
    // "Trà sữa",
    // "Trà xanh",
    // "Đá xay",
    // "Cà phê",
    // "Bánh ngọt",
    // "Bánh mặn",
    // "Cơm nhà",
    // "Đồ uống nóng",
    // "Đồ uống đóng gói",
    // "Topping",
  ];

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionsRef: { [key: string]: React.RefObject<View> } = {
    "Món mới": useRef<View>(null),
    "Trà trái cây": useRef<View>(null),
    "Trà sữa": useRef<View>(null),
    "Trà xanh": useRef<View>(null),
    "Đá xay": useRef<View>(null),
    "Cà phê": useRef<View>(null),
    "Bánh ngọt": useRef<View>(null),
    "Bánh mặn": useRef<View>(null),
    "Cơm nhà": useRef<View>(null),
    "Đồ uống nóng": useRef<View>(null),
    "Đồ uống đóng gói": useRef<View>(null),
    Topping: useRef<View>(null),
  };

  const handleScroll = (category: string) => {
    const section = sectionsRef[category]?.current;
    const scrollView = scrollViewRef.current;
    if (section && scrollView) {
      section.measure((pageX: number, pageY: number) => {
        scrollView.scrollTo({ x: pageX, y: pageY - 32, animated: true });
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="absolute top-0 left-0 right-0 z-10 bg-white">
          <Header />
        </View>
        <ScrollView className="mt-16" ref={scrollViewRef}>
          <View className="mt-4">
            <Category handleScroll={handleScroll} />
          </View>
          <Collection />
          {categories.map((category) => (
            <View key={category} ref={sectionsRef[category]}>
              <Drinks title={category} drinks={drinkProps} />
            </View>
          ))}
        </ScrollView>
      </View>
      <CheckoutBtn />
    </SafeAreaView>
  );
}
