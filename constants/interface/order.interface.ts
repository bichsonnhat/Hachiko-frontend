export interface IOrder {
    id?: string,
    userId: string,
    orderAddress: string,
    orderTime: Date,
    orderCost: number,
    paymentMethod: string,
    voucherId?: string,
    recipientName: string,
    recipientPhone: string,
    storeId: string,
    orderStatus: string,
    createdAt: Date,
}

export interface IOrderItem {
    id?: string,
    orderId?: string,
    productId: string,
    productImage: string, 
    productName: string,
    topping: string,
    quantity: number,
    price: number,
    note: string,
    size: string,
}

export interface IFullOrder {
    order: IOrder,
    orderItems: IOrderItem[],
}