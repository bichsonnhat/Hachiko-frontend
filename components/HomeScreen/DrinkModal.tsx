import React, { useMemo } from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
} from "react-native";
import { MinusIcon, Plus, Heart, HeartOff } from "lucide-react-native";
import { ExpandableText } from "@/components/ui";
import { RadioGroup } from "react-native-radio-buttons-group";
import Checkbox from "expo-checkbox";
import { IProduct } from "@/constants";

const TOPPINGS = [
    { id: "1", name: "Trái Vải", price: 8000 },
    { id: "2", name: "Hạt Sen", price: 8000 },
    { id: "3", name: "Thạch Cà Phê", price: 6000 },
    { id: "4", name: "Trân châu trắng", price: 6000 },
    { id: "5", name: "Đào Miếng", price: 10000 },
];

interface DrinkModalProps {
    visible: boolean;
    onClose: () => void;
    drink: IProduct;
    isFavourite: boolean;
    toggleFavourite: () => void;
    quantity: number;
    setQuantity: (value: number) => void;
    note: string;
    setNote: (value: string) => void;
    selectedSize: string;
    setSelectedSize: (value: string) => void;
    selectedToppings: string[];
    toggleTopping: (name: string) => void;
    calculatePrice: () => number;
    addDrinkToCart: () => void;
    check: boolean;
}

export const DrinkModal: React.FC<DrinkModalProps> = ({
    visible,
    onClose,
    drink,
    isFavourite,
    toggleFavourite,
    quantity,
    setQuantity,
    note,
    setNote,
    selectedSize,
    setSelectedSize,
    selectedToppings,
    toggleTopping,
    calculatePrice,
    addDrinkToCart,
    check,
}) => {
    const radioButtons = useMemo(
        () => [
            {
                id: "medium",
                label: `Vừa - ${(drink.price + 10000).toLocaleString("vi-VN")}đ`,
                value: (drink.price + 10000).toString(),
            },
            {
                id: "small",
                label: `Nhỏ - ${drink.price.toLocaleString("vi-VN")}đ`,
                value: drink.price.toString(),
            },
        ],
        [drink.price]
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center">
                <View className="w-full h-full bg-white">
                    <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                        <View className="relative">
                            <Image
                                source={{ uri: drink.imageUrl }}
                                className="w-full h-[360px]"
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                                onPress={onClose}
                            >
                                <MinusIcon size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View className="p-4 pb-24">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-xl font-bold w-[80%]">{drink.title}</Text>
                                <TouchableOpacity
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    onPress={toggleFavourite}
                                >
                                    {isFavourite ? (
                                        <HeartOff size={24} color="red" />
                                    ) : (
                                        <Heart size={24} color="red" />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <Text className="text-lg font-semibold mt-1">
                                {drink.price.toLocaleString("vi-VN")}đ
                            </Text>
                            <ExpandableText
                                text={drink.description}
                                className="text-gray-600 mt-2"
                            />

                            <View className="border-t border-gray-300 mt-4 pt-4">
                                <View className="flex-row gap-1">
                                    <Text className="font-semibold text-lg">Size</Text>
                                    <Text className="text-red-600">*</Text>
                                </View>
                                <RadioGroup
                                    radioButtons={radioButtons}
                                    onPress={setSelectedSize}
                                    selectedId={selectedSize}
                                    containerStyle={{ alignItems: "flex-start" }}
                                />
                            </View>

                            <View className="border-t border-gray-300 mt-4 pt-4">
                                <Text className="font-semibold text-lg">Topping</Text>
                                <View className="grid grid-cols-2 gap-2 mt-2">
                                    {TOPPINGS.map((topping) => (
                                        <View
                                            key={topping.id}
                                            className="flex-row items-center gap-2 ml-3"
                                        >
                                            <Checkbox
                                                disabled={
                                                    check ||
                                                    (selectedToppings.length >= 2 &&
                                                        !selectedToppings.includes(topping.name))
                                                }
                                                style={{ width: 20, height: 20 }}
                                                value={selectedToppings.includes(topping.name)}
                                                onValueChange={() => {
                                                    if (
                                                        selectedToppings.includes(topping.name) ||
                                                        selectedToppings.length < 2
                                                    ) {
                                                        toggleTopping(topping.name);
                                                    }
                                                }}
                                            />
                                            <Text>
                                                {topping.name} - {topping.price.toLocaleString("vi-VN")}đ
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View className="border-t border-gray-300 mt-4 pt-4">
                                <Text className="font-semibold text-lg">Yêu cầu khác</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-md p-2 mt-2"
                                    placeholder="Thêm ghi chú"
                                    value={note}
                                    onChangeText={setNote}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <View className="absolute bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200 shadow-md">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-4">
                                <TouchableOpacity
                                    className="w-10 h-10 rounded-full bg-amber-300 flex items-center justify-center"
                                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity === 1}
                                >
                                    <MinusIcon size={20} color="white" />
                                </TouchableOpacity>
                                <Text className="text-lg font-bold">{quantity}</Text>
                                <TouchableOpacity
                                    className="w-10 h-10 rounded-full bg-amber-300 flex items-center justify-center"
                                    onPress={() => setQuantity(quantity + 1)}
                                >
                                    <Plus size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                className="bg-orange-500 px-6 py-3 rounded-full flex-row items-center justify-center"
                                onPress={addDrinkToCart}
                            >
                                <Text className="text-white font-bold text-lg">
                                    {`${calculatePrice().toLocaleString("vi-VN")}đ`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};