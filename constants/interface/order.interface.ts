export interface IOrder {
    id: string,
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
    orderItems: IOrderItem[],
    createdAt: Date,
}

export interface IOrderItem {
    id: string,
    productId: string,
    quantity: number,
    size: string,
    topping: string,
    note: string,
    price: number,
}