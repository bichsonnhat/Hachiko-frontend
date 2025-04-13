import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrinkOrder } from "@/constants";

type CartState = {
  cart: DrinkOrder[];
  addToCart: (drink: DrinkOrder) => void;
  removeFromCart: (drink_name: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (drink) =>
        set((state) => {
          const existing = state.cart.find(
            (d) => d.drink_name === drink.drink_name
          );
          if (existing) {
            return {
              cart: state.cart.map((d) =>
                d.drink_name === drink.drink_name
                  ? {
                      ...d,
                      drink_quantity: d.drink_quantity + drink.drink_quantity,
                    }
                  : d
              ),
            };
          }
          return { cart: [...state.cart, drink] };
        }),
      removeFromCart: (drink_name) =>
        set((state) => ({
          cart: state.cart.filter((d) => d.drink_name !== drink_name),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
