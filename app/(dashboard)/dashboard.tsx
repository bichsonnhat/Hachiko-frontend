import { ThemedView } from "@/components/ThemedView";
import { LogOut, Plus, Folder, Store, Package, ChevronRight, User, Bell, Ticket } from "lucide-react-native";
import { View, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { twMerge } from 'tailwind-merge';
import { router } from "expo-router";

const data = [
  { id: '1', title: 'Đơn hàng đã xác nhận', value: "100", color: "bg-green-500" },
  { id: '2', title: 'Đơn hàng đã hủy', value: "100", color: "bg-red-500" },
  { id: '3', title: 'Đơn hàng đang chờ', value: "100", color: "bg-yellow-500" },
  { id: '4', title: 'Thống kê doanh thu', value: "100đ", color: "bg-blue-500" },
];

// Add this after the existing data array
const tools = [
  {
    id: '1',
    title: 'Quản lí danh mục',
    icon: Folder,
    route: '/category'
  },
  {
    id: '2',
    title: 'Quản lí cửa hàng',
    icon: Store,
    route: '/store'
  },
  {
    id: '3',
    title: 'Quản lí sản phẩm',
    icon: Package,
    route: '/product'
  },
  {
    id: '4',
    title: 'Quản lí voucher',
    icon: Ticket,
    route: '/voucher'
  },
  {
    id: '5',
    title: 'Quản lí thông báo',
    icon: Bell,
    route: '/notification'
  },
  {
    id: '6',
    title: 'Quản lí người dùng',
    icon: User,
    route: '/user'
  }
];

// Calculate item width based on screen width
const { width } = Dimensions.get('window');
const numColumns = 2;
const spacing = 16;
const cardWidth = (width - (spacing * (numColumns + 1))) / numColumns;

// Card component
const Card = ({ item }: { item: any }) => (
  <View style={[styles.card]} className={twMerge(
    item.color,
    "rounded-xl justify-between"
  )}>
    <Text className="text-white font-medium text-3xl">{item.title}</Text>
    <Text className="text-white font-bold text-3xl">{item.value}</Text>
  </View>
);


// Grid implementation
const GridView = () => (
  <View style={styles.container}>
    <View style={styles.row}>
      {data.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </View>
  </View>
);

export default function Dashboard() {
    const { signOut } = useAuth();
    return (
        <SafeAreaView className="flex-1 bg-white h-full">
            {/* Header */}
            <View className="flex flex-row justify-between px-4">
                <Text className="text-2xl font-bold mt-4">Dashboard</Text>
                <TouchableOpacity onPress={() => signOut()}>
                    <ThemedView className={`w-12 h-12 mt-3 bg-white rounded-full flex items-center justify-center shadow-md shadow-slate-600`}>
                        <LogOut size={20} color="black" />
                    </ThemedView>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <FlatList
                ListHeaderComponent={() => (
                    <View>
                        <GridView />
                        <View className="mt-1 px-4">
                            <Text className="text-2xl font-bold">Tools</Text>
                        </View>
                    </View>
                )}
                data={tools}
                renderItem={({ item: tool }) => (
                    <View className="px-4">
                        <TouchableOpacity 
                            key={tool.id}
                            className="flex-row items-center justify-between bg-white p-4 rounded-xl shadow-md shadow-slate-600 mb-4"
                            onPress={() => router.push(`/(dashboard)/${tool.route}`)}
                        >
                            <View className="flex-row items-center">
                                <tool.icon size={24} color="black" />
                                <Text className="ml-2 font-medium">{tool.title}</Text>
                            </View>
                            <ChevronRight size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      padding: spacing,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing,
    },
    card: {
      width: cardWidth,
      height: cardWidth,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });