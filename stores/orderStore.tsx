import { DrinkOrder } from "@/constants";
import { create } from "zustand";

export const useOrderStore = create((set) => ({
  drinks: [] as DrinkOrder[],
  addDrink: (drink: DrinkOrder) =>
    set((state: { drinks: DrinkOrder[] }) => ({
      drinks: [...state.drinks, drink],
    })),
  removeDrink: (drink: DrinkOrder) =>
    set((state: { drinks: DrinkOrder[] }) => ({
      drinks: state.drinks.filter(
        (d: DrinkOrder) => d.drink_name !== drink.drink_name
      ),
    })),
  updateDrink: (drink: DrinkOrder) =>
    set((state: { drinks: DrinkOrder[] }) => ({
      drinks: state.drinks.map((d: DrinkOrder) =>
        d.drink_name === drink.drink_name ? drink : d
      ),
    })),
  clearDrinks: () => set({ drinks: [] }),
}));
