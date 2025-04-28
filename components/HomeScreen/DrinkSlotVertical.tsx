import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Plus, Check, Heart, HeartOff } from "lucide-react-native";
import { useCartStore } from "@/stores";
import { IFavouriteProduct, IOrderItem, IProduct } from "@/constants";
import { generateObjectId } from "@/utils/helpers/randomHexString";
import { useApi } from "@/hooks/useApi";
import apiService from "@/constants/config/axiosConfig";
import { DrinkModal } from "./DrinkModal";

type DrinkSlotVerticalProps = {
  drink: IProduct;
  check: boolean;
};

const USER_ID = "67ea8e54c54fd6723fbf8f0e";

export const DrinkSlotVertical: React.FC<DrinkSlotVerticalProps> = ({
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
    const basePrice = selectedSize === "medium" ? drink.price + 10000 : drink.price;
    const toppingPrice = selectedToppings.reduce((total, toppingName) => {
      const topping = TOPPINGS.find((t) => t.name === toppingName);
      return total + (topping?.price || 0);
    }, 0);
    return (basePrice + toppingPrice) * quantity;
  }, [selectedSize, selectedToppings, quantity, drink.price]);

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
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="w-[165px] mb-4 "
      >
        <View className="bg-white rounded-2xl relative">
          <View className="w-[165px] h-[165px] mb-3">
            <Image
              source={{ uri: drink.imageUrl }}
              className="w-[165px] h-full rounded-xl"
              resizeMode="contain"
            />
          </View>

          <View className="w-full flex-row items-center justify-between">
            <Text className="font-semibold text-lg0" numberOfLines={2} style={{ lineHeight: 20, height: 40 }}>
              {drink.title}
            </Text>
          </View>

          <View className="w-full mb-3 flex-row items-center justify-between">
            <Text className="flex-1">{drink.price.toLocaleString("vi-VN")}đ</Text>

            <TouchableOpacity
              className={`w-8 h-8 p-[2px] rounded-full items-center justify-center ml-auto ${cart.findIndex((d) => d.productId === drink.id) === -1
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

      <DrinkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        drink={drink}
        isFavourite={isFavourite}
        toggleFavourite={toggleFavourite}
        quantity={quantity}
        setQuantity={setQuantity}
        note={note}
        setNote={setNote}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedToppings={selectedToppings}
        toggleTopping={toggleTopping}
        calculatePrice={calculatePrice}
        addDrinkToCart={addDrinkToCart}
        check={check}
      />
    </>
  );
};

const TOPPINGS = [
  { id: "1", name: "Trái Vải", price: 8000 },
  { id: "2", name: "Hạt Sen", price: 8000 },
  { id: "3", name: "Thạch Cà Phê", price: 6000 },
  { id: "4", name: "Trân châu trắng", price: 6000 },
  { id: "5", name: "Đào Miếng", price: 10000 },
];