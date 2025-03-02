import { DrinkOrder } from "./app.interface";

export interface OrderStore {
  drinks: DrinkOrder[];
  addDrink: (drink: DrinkOrder) => void;
  removeDrink: (drink: DrinkOrder) => void;
  updateDrink: (drink: DrinkOrder) => void;
  clearDrinks: () => void;
};