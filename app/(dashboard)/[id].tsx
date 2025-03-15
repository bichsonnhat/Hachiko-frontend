import { useLocalSearchParams, router } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function ToolPage() {
  const { id } = useLocalSearchParams();

  if (!id) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-2xl font-bold">Tool: {id}</Text>
      {/* Add your tool-specific content here */}
    </SafeAreaView>
  );
}
