import { Dimensions, Image, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect } from 'react';
import Carousel from "react-native-reanimated-carousel";
import Animated, { useSharedValue, useAnimatedStyle, interpolate } from "react-native-reanimated";
import { IAdvertisement } from "@/constants/interface/advertisement.interface";
import { router } from "expo-router";

interface SliderProps {
    advertisements: IAdvertisement[];
}

const Slider: React.FC<SliderProps> = ({ advertisements }) => {
    const width = Dimensions.get('window').width;
    const progress = useSharedValue(0);

    const handleImagePress = (id: string) => {
        router.push(`/(tabs)/home/advertisement/${id}`);
    };

    return (
        <View style={{ height: width / 2 }} className="relative">
            <View style={{ flex: 1 }}>
                <Carousel
                    width={width}
                    height={width / 2}
                    data={advertisements}
                    autoPlay={true}
                    pagingEnabled={true}
                    scrollAnimationDuration={2500}
                    onProgressChange={(_, absoluteProgress) => {
                        progress.value = absoluteProgress;
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex-1 px-5 justify-center overflow-hidden"
                            activeOpacity={0.8}
                            onPress={() => handleImagePress(item.id)}
                        >
                            <Image className="w-full h-full" source={{ uri: item.imageUrl }} />
                        </TouchableOpacity>
                    )}
                />

                <View className="absolute bottom-2 left-0 right-0 flex-row justify-center">
                    {advertisements.map((_, index) => {
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

export default Slider;