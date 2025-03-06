import {ImageSourcePropType} from "react-native";

export interface DrinkOrder {
    drink_price: number;
    drink_name: string;
    drink_note: string;
    drink_quantity: number;
};

export interface DrinkPropertie {
    drink_img: ImageSourcePropType;
    drink_name: string;
    drink_price: number;
    drink_description: string;
}

export interface Store {
    id: number;
    name: string;
    address: string;
    distance: number;
    open_time: Date;
    close_time: Date;
    image: string;

}