import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IOrderItem } from "@/constants";

type CartState = {
  cart: IOrderItem[];
  checkExist: (
    productId: string,
    size: string,
    note: string,
    topping: string
  ) => boolean;
  addNewToCart: (item: IOrderItem) => void;
  addExistingToCart: (productId: string) => void;
  removeExistingFromCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      checkExist: (productId, size, note, topping) => {
        const existingItem = get().cart.find(
          (item) =>
            item.productId === productId &&
            item.size === size &&
            item.note === note &&
            item.topping === topping
        );
        return !!existingItem;
      },
      addNewToCart: (newProduct) => {
        set((state) => ({
          cart: [...state.cart, newProduct],
        }));
      },
      removeExistingFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        }));
      },
      addExistingToCart: (productId) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));
      },
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter(
            (cartProduct) => cartProduct.productId !== productId
          ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
