import { View, Text, FlatList } from 'react-native'
import React from 'react'
import CategoryItem from './CategoryItem'

export default function Category() {
    const list = [
        {
            id: 1,
            image: require('@/assets/images/Category/item_1.png'),
            name: "Giao hàng",
            path: '/(tabs)/order'
        },
        {
            id: 2,
            image: require('@/assets/images/Category/item_7.png'),
            name: "Feedback",
            path: '/(tabs)/other/order-feedback'
        },
        {
            id: 3,
            image: require('@/assets/images/Category/item_6.png'),
            name: "Lịch sử đơn hàng",
            path: '/(tabs)/other/order-history'
        },
        {
            id: 4,
            image: require('@/assets/images/Category/item_3.png'),
            name: "Thông tin cá nhân",
            path: '/(tabs)/other/update-info'
        },

    ]

    return (
        <View className='mt-4 px-5 '>
            {/* <Text>Category</Text> */}
            <FlatList
                className='rounded-xl border-[1.5px] border-gray-300'
                data={list}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <CategoryItem categoryItem={item} />
                )}
            />
        </View>
    )
}