import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Plus, MinusIcon, Heart, Check, HeartOff } from "lucide-react-native";
import { ExpandableText } from "@/components/ui";
import { RadioGroup } from "react-native-radio-buttons-group";
import Checkbox from "expo-checkbox";
import { useCartStore } from "@/stores";
import { IFavouriteProduct, IOrderItem, IProduct } from "@/constants";
import { generateObjectId } from "@/utils/helpers/randomHexString";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";

type DrinkSlotHorizontalProps = {
  drink: IProduct;
  check: (categoryId: string) => boolean;
};

const USER_ID = "67ea8e54c54fd6723fbf8f0e";

const TOPPINGS = [
  { id: "1", name: "Trái Vải", price: 8000 },
  { id: "2", name: "Hạt Sen", price: 8000 },
  { id: "3", name: "Thạch Cà Phê", price: 6000 },
  { id: "4", name: "Trân châu trắng", price: 6000 },
  { id: "5", name: "Đào Miếng", price: 10000 },
];

export const DrinkSlotHorizontal: React.FC<DrinkSlotHorizontalProps> = ({
  drink,
  check,
}) => {
  const { cart, addNewToCart, addExistingToCart, checkExist } = useCartStore();
  const { callApi: callFavouriteApi } = useApi<void>();

  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selectedSize, setSelectedSize] = useState("small");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isFavourite, setIsFavourite] = useState(false);

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

  const toggleTopping = (name: string) => {
    setSelectedToppings((prev) =>
      prev.includes(name)
        ? prev.filter((topping) => topping !== name)
        : [...prev, name]
    );
  };

  const resetModalState = () => {
    setQuantity(1);
    setNote("");
    setSelectedToppings([]);
    setSelectedSize("small");
  };

  const calculatePrice = useCallback(() => {
    const basePrice =
      radioButtons.find((r) => r.id === selectedSize)?.value || "0";
    const toppingPrice = selectedToppings.reduce((total, toppingName) => {
      const topping = TOPPINGS.find((t) => t.name === toppingName);
      return total + (topping?.price || 0);
    }, 0);
    return (Number(basePrice) + toppingPrice) * quantity;
  }, [radioButtons, selectedSize, selectedToppings, quantity]);

  const addDrinkToCart = () => {
    if (
      checkExist(
        drink.id ?? "",
        selectedSize,
        note,
        selectedToppings.join(", ")
      )
    ) {
      addExistingToCart(drink.id ?? "");
    } else {
      const newItem: IOrderItem = {
        id: generateObjectId(),
        productId: drink.id ?? "",
        productImage: drink.imageUrl,
        productName: drink.title,
        topping: selectedToppings.join(", "),
        quantity,
        price: calculatePrice(),
        note,
        size: selectedSize,
      };
      addNewToCart(newItem);
    }
    setModalVisible(false);
    resetModalState();
  };

  const fetchFavouriteStatus = useCallback(async () => {
    await callFavouriteApi(async () => {
      const { data } = await apiService.get(
        `/favourite-products/${USER_ID}/${drink.id}`
      );
      setIsFavourite(!!data);
    });
  }, [drink.id]);

  const toggleFavourite = async () => {
    if (isFavourite) {
      await callFavouriteApi(async () => {
        await apiService.delete(`/favourite-products/${drink.id}`);
        Alert.alert("Xoá sản phẩm yêu thích thành công!");
      });
      setIsFavourite(false);
    } else {
      await callFavouriteApi(async () => {
        const sendData: IFavouriteProduct = {
          userId: USER_ID,
          productId: drink.id ?? "",
        };
        await apiService.post(`/favourite-products`, sendData);
        Alert.alert("Thêm sản phẩm yêu thích thành công!");
      });
      setIsFavourite(true);
    }
  };

  useEffect(() => {
    fetchFavouriteStatus();
  }, [fetchFavouriteStatus]);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View className="relative rounded-2xl p-3 shadow-lg bg-white flex-row items-center gap-4">
          <View className="w-1/3 h-32 rounded-lg">
            <Image
              source={{ uri: drink.imageUrl }}
              className="w-full h-full rounded-2xl"
              resizeMode="contain"
            />
          </View>
          <View className="flex-1 flex-row items-center justify-between">
            <View className="flex-col gap-2 max-w-[160px]">
              <Text className="font-semibold">{drink.title}</Text>
              <Text>{drink.price.toLocaleString("vi-VN")}đ</Text>
            </View>
            <TouchableOpacity
              className={`w-8 h-8 p-[2px] rounded-full flex items-center justify-center ${cart.findIndex((d) => d.productId === drink.id) === -1
                  ? "bg-orange-300"
                  : "bg-green-500"
                }`}
              onPress={addDrinkToCart}
            >
              {cart.findIndex((d) => d.productId === drink.id) === -1 ? (
                <Plus size={22} color="white" />
              ) : (
                <Check size={22} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="w-full h-full bg-white">
            <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
              {/* Image + Close */}
              <View className="relative">
                <Image
                  source={{ uri: drink.imageUrl }}
                  className="w-full h-[360px]"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  onPress={() => setModalVisible(false)}
                >
                  <MinusIcon size={24} color="black" />
                </TouchableOpacity>
              </View>

              <View className="p-4 pb-24">
                {/* Title + Favourite */}
                <View className="flex-row justify-between items-center">
                  <Text className="text-xl font-bold w-[80%]">
                    {drink.title}
                  </Text>
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

                {/* Size Select */}
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

                {/* Topping Select */}
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
                            check(drink.categoryID) ||
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
                          {topping.name} -{" "}
                          {topping.price.toLocaleString("vi-VN")}đ
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Notes */}
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

            {/* Bottom Price + Quantity */}
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
    </>
  );
};
