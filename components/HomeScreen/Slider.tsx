import { Dimensions, Image, View } from "react-native";
import React from 'react';
import Carousel from "react-native-reanimated-carousel";
import Animated, { useSharedValue, useAnimatedStyle, interpolate } from "react-native-reanimated";

export default function Slider() {
    const width = Dimensions.get('window').width;
    const progress = useSharedValue(0);

    const list = [
        { id: 1, image: require('@/assets/images/Slider/image_1.png') },
        { id: 2, image: require('@/assets/images/Slider/image_2.png') },
        { id: 3, image: require('@/assets/images/Slider/image_3.png') },
        { id: 4, image: require('@/assets/images/Slider/image_4.png') },
        { id: 5, image: require('@/assets/images/Slider/image_5.png') },
        { id: 6, image: require('@/assets/images/Slider/image_6.png') },
        { id: 7, image: require('@/assets/images/Slider/image_7.png') },
    ];

    return (
        <View style={{ height: width / 2 }} className="relative">
            <View style={{ flex: 1 }}>
                <Carousel
                    width={width}
                    height={width / 2}
                    data={list}
                    autoPlay={true}
                    pagingEnabled={true}
                    scrollAnimationDuration={1500}
                    onProgressChange={(_, absoluteProgress) => {
                        progress.value = absoluteProgress;
                    }}
                    renderItem={({ item }) => (
                        <View className="flex-1 px-5 justify-center overflow-hidden">
                            <Image className="w-full h-full" source={item.image} />
                        </View>
                    )}
                />

                <View className="absolute bottom-2 left-0 right-0 flex-row justify-center">
                    {list.map((_, index) => {
                        const animatedStyle = useAnimatedStyle(() => {
                            const scale = interpolate(progress.value, [index - 1, index, index + 1], [1, 1.5, 1]);
                            const opacity = interpolate(progress.value, [index - 1, index, index + 1], [0.5, 1, 0.5]);

                            return {
                                transform: [{ scale }],
                                opacity,
                            };
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    {
                                        width: 7,
                                        height: 7,
                                        marginHorizontal: 5,
                                        borderRadius: 5,
                                        backgroundColor: "#ffffff",
                                    },
                                    animatedStyle,
                                ]}
                            />
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
