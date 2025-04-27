export interface IStatistic {
    numberOfCompletedOrders: number;
    numberOfPendingOrders: number;
    numberOfCancelledOrders: number;
    totalRevenue: number;
}
export interface IProductStatistic {
    productId: string,
    productName: string,
    productImage: string,
    quantitySold: number,
}

export interface IRevenueStatistic {
    labels: string[],
    data: number[],
}