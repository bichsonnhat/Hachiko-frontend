import { SafeAreaView, View } from 'react-native';

import Header from '@/components/Home/Header';
import Slider from '@/components/Home/Slider';
import { ThemedView } from '@/components/ThemedView';
import Category from '@/components/Home/Category';

export default function HomeScreen() {
    return (
        <View className='flex bg-white h-full'>
            <Header />
            <Slider />
            <Category />
        </View>
    );
}