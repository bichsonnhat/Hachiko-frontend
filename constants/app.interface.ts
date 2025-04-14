import {ImageSourcePropType} from "react-native";

export interface DrinkOrder {
    drink_price: number;
    drink_name: string;
    drink_note: string;
    drink_quantity: number;
};

export interface MongoID {
    timestamp: number;
    date: string;
}

export interface CategoryFromAPI {
    id: MongoID;
    name: string;
    imgUrl: string;
}
  
export interface ProductFromAPI {
    _id: MongoID;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    categoryID: MongoID;
}
  
export interface CategoryGroup {
    _id: MongoID; 
    products: ProductFromAPI[];
}

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

export interface Category {
    id: number;
    name: string;
    image: string;
}

