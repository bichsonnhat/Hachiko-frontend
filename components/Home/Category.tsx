import { View, Text, FlatList } from 'react-native'
import React from 'react'
import CategoryItem from './CategoryItem'

export default function Category() {
    const list = [
        {
            id: 1,
            image: require('@/assets/images/Category/item_1.png'),
            name: "Giao hàng"
        },
        {
            id: 2,
            image: require('@/assets/images/Category/item_2.png'),
            name: "Mang đi"
        },
        {
            id: 3,
            image: require('@/assets/images/Category/item_3.png'),
            name: "Tại bàn"
        },
        {
            id: 4,
            image: require('@/assets/images/Category/item_4.png'),
            name: "Cà phê hạt rang"
        },
        {
            id: 5,
            image: require('@/assets/images/Category/item_5.png'),
            name: "Đổi bean"
        },
        // {
        //     id: 6,
        //     image: require('@/assets/images/Category/item_6.png')
        // },
        // {
        //     id: 7,
        //     image: require('@/assets/images/Category/item_7.png')
        // },
        {
            id: 8,
            image: require('@/assets/images/Category/item_8.png'),
            name: "Hạng thành viên"
        },
    ]

    return (
        <View className='mt-4 px-5 '>
            {/* <Text>Category</Text> */}
            <FlatList
                className='rounded-xl border-2 border-gray-300'
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