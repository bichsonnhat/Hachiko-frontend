import { ProductFromAPI } from '@/constants';
import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { DrinkSlotVertical } from './DrinkSlotVerticalProps';

interface ProductGridProps {
    title: string;
    products: ProductFromAPI[];
    numColumns?: number;
}

const ProductGridSection: React.FC<ProductGridProps> = ({ title, products, numColumns, }) => {
    return (
        <View className="pl-5 mt-3">
            <Text className="font-bold text-xl mb-3">{title}</Text>

            <FlatList
                data={products}
                keyExtractor={(item) => item.title}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={{ flex: 1 }}>
                        <DrinkSlotVertical drink={item} />
                    </View>
                )}
            />
        </View>
    );
};

export default ProductGridSection;