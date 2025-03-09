import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

interface CategoryItemProps {
    categoryItem: {
        id: number;
        image: any;
        name: string;
        path: string;
    };
}


export default function CategoryItem({ categoryItem }: CategoryItemProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(categoryItem.path as any)}
            className="w-[87.5px]  bg-white rounded-lg items-center justify-center">
            <Image source={categoryItem.image} className="w-[45px] h-[45px] mt-2" resizeMode="contain" />
            <Text
                className="text-center font-semibold mt-2 mb-2  text-[15px] w-[70px]"
                numberOfLines={2}
            >
                {categoryItem.name}
            </Text>
        </TouchableOpacity>
    );
}