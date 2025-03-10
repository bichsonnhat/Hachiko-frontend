import { SafeAreaView, View } from 'react-native';

import Header from '@/components/HomeScreen/Header';
import Slider from '@/components/HomeScreen/Slider';
import { ThemedView } from '@/components/ThemedView';
import Category from '@/components/HomeScreen/Category';

export default function HomeScreen() {
    return (
        <View className='flex bg-white h-full'>
            <Header />
            <Slider />
            <Category />
        </View>
    );
}