export interface IProduct {
    id: string,
    description: string,
    imageUrl: string,
    price: number,
    title: string,
    categoryID: string,
}

export interface IFavouriteProduct {
    id: string,
    userId: string,
    productId: string
}

export interface IProductByCategory {
    _id: string,
    categoryID: string,
    products: IProduct[]
}