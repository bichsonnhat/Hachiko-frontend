import { View, Text, Image } from 'react-native'
import React from 'react'

interface CategoryItemProps {
    categoryItem: {
        id: number;
        image: any;
        name: string;
    };
}


export default function CategoryItem({ categoryItem }: CategoryItemProps) {
    return (
        <View className="w-[87.5px]  bg-white rounded-lg items-center justify-center">
            <Image source={categoryItem.image} className="w-[45px] h-[45px] mt-2" resizeMode="contain" />
            <Text
                className="text-center font-semibold mt-2 mb-2  text-[15px] w-[70px]"
                numberOfLines={2}
            >
                {categoryItem.name}
            </Text>
        </View>
    );
}