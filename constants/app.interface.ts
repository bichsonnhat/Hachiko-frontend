export interface DrinkOrder {
    drink_price: number;
    drink_name: string;
    drink_note: string;
    drink_quantity: number;
};

export interface CategoryFromAPI {
    id: string;
    name: string;
    imgUrl: string;
}
  
export interface ProductFromAPI {
    _id: string;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    categoryID: string;
}
  
export interface CategoryGroup {
    _id: string; 
    products: ProductFromAPI[];
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