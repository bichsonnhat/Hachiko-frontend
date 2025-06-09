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
            className="w-[87.5px] h-[100px] bg-white rounded-lg items-center justify-between py-2"
        >
            <Image
                source={categoryItem.image}
                className="w-[45px] h-[45px]"
                resizeMode="contain"
                style={{ marginTop: 0, marginBottom: 0 }}
            />
            <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Text
                    className="text-center font-semibold text-[14px] w-[70px]"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {categoryItem.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
}