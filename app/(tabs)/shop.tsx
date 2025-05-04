import React, { useState } from "react";
import { 
  View, 
  Text, 
  FlatList,
  ActivityIndicator
} from "react-native";
import StoreItem from "@/components/ShopScreen/StoreItem";
import ShopHeader from "@/components/ShopScreen/ShopHeader";
import { Store } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data (this would typically come from API)
const storesNearby: Store[] = [
  {
    id: 2,
    name: "HCM Lê Văn Sỹ",
    address: "HCM Lê Văn Sỹ, Hồ Chí Minh",
    open_time: new Date(),
    close_time: new Date(),
    distance: 0.7,
    image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
  },
];

const otherStores: Store[] = [
  {
    id: 2,
    name: "HCM Lê Văn Sỹ",
    address: "HCM Lê Văn Sỹ, Hồ Chí Minh",
    open_time: new Date(),
    close_time: new Date(),
    distance: 0.7,
    image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F4%20-%206%20%E1%BA%A4p%20B%E1%BA%AFc%2C%20Q.%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=9ae3c801-ee03-43b8-910f-0c075e2b1a95",
  },
  {
    id: 3,
    name: "HCM Hoàng Việt",
    address: "HCM Hoàng Việt, Hồ Chí Minh",
    open_time: new Date(),
    close_time: new Date(),
    distance: 0.7,
    image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F57%20Xu%C3%A2n%20Th%E1%BB%A7y%2C%20Th%E1%BA%A3o%20%C4%90i%E1%BB%81n%2C%20Qu%E1%BA%ADn%202%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=8bcbecf5-22d5-4ddb-9567-e01ffecbd85b",
  },
  {
    id: 4,
    name: "HCM Sư Vạn Hạnh",
    address: "HCM Sư Vạn Hạnh, Hồ Chí Minh",
    open_time: new Date(),
    close_time: new Date(),
    distance: 1.4,
    image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F670%20Nguy%E1%BB%85n%20Duy%20Trinh%2C%20B%C3%ACnh%20Tr%C6%B0ng%20%C4%90%C3%B4ng%2C%20Qu%E1%BA%ADn%202%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=84026453-8103-4c84-afa7-985a3e2ba354",
  },
  {
    id: 5,
    name: "HCM Quang Trung",
    address: "HCM Quang Trung, Hồ Chí Minh",
    open_time: new Date(),
    close_time: new Date(),
    distance: 1.45,
    image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2F75%20Nguy%E1%BB%85n%20V%C4%83n%20Th%C6%B0%C6%A1ng%2C%20Ph%C6%B0%E1%BB%9Dng%2025%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vietnam.png?alt=media&token=2bdd2463-c315-4209-bf66-76060dc918b9 ",
  },
  {
    id: 6,
    name: "HN Bà Triệu",
    address: "HN Bà Triệu, Hà Nội",
    open_time: new Date(),
    close_time: new Date(),
    distance: 1154.57,
    image: "https://firebasestorage.googleapis.com/v0/b/thehachikocoffee-aed51.appspot.com/o/Store%2FT%E1%BA%A7ng%201%20D%E1%BB%B1%20%C3%A1n%20Chung%20c%C6%B0%20cao%20c%E1%BA%A5p%20Homyland%20Riverside%2C%20%C4%90.%20Nguy%E1%BB%85n%20Duy%20Trinh%2C%20P.%20B%C3%ACnh%20Tr%C6%B0ng%20T%C3%A2y%2C%20Qu%E1%BA%ADn%202%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh.png?alt=media&token=94f584d3-53b7-44ac-bc1e-b4c6e9f5ad9d",
  },
];

// Types for section rendering
type SectionItem = {
  type: "nearby" | "other";
  title: string;
  data: Store[];
};

export default function ShopScreen() {
  const [loading, setLoading] = useState(false);
  const [sectionData, setSectionData] = useState<SectionItem[]>([
    { 
      type: "nearby", 
      title: "Cửa hàng gần bạn", 
      data: storesNearby 
    },
    { 
      type: "other", 
      title: "Các cửa hàng khác", 
      data: otherStores 
    }
  ]);

  // Render each section (Nearby or Other stores)
  const SectionListItem = React.memo(({ item }: { item: SectionItem }) => {
    return (
      <View className="flex-col pb-4 border-b border-gray-100">
        <Text className="text-lg font-bold px-4 py-2">{item.title}</Text>
        <View>
          {item.data.map((store) => (
            <View key={store.id} className="mb-3 px-4">
              <StoreItem store={store} />
            </View>
          ))}
        </View>
      </View>
    );
  });

  const renderItem = ({ item }: { item: SectionItem }) => {
    return <SectionListItem item={item} />;
  };

  const keyExtractor = (item: SectionItem, index: number) => {
    return `section-${item.type}-${index}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
      <ShopHeader />
      
      <View className="flex-1 bg-white">
        {loading ? (
          <View className="flex-1 items-center justify-center h-full">
            <ActivityIndicator size="large" color="#FF8C00" />
          </View>
        ) : sectionData.length === 0 ? (
          <View className="flex-1 items-center justify-center h-full">
            <Text className="text-lg text-gray-500">Không tìm thấy cửa hàng</Text>
          </View>
        ) : (
          <FlatList
            data={sectionData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            contentContainerStyle={{ paddingTop: 0, paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
