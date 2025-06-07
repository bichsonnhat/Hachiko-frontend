import { ReactElement } from "react";

export interface IVoucher {
    id?: string,
    title: string,
    description: string,
    imgUrl: string,
    discountPrice: number,
    discountPercent: number,
    isFreeShip: boolean,
    minOrderPrice: number,
    minOrderItem: number,
    type: string,
    expiryDate: Date,
}

export interface IVoucherDropdown {
    label: ReactElement,
    value: string,
}