import { ReactElement } from "react";

export interface IStore {
    id?: string,
    name: string,
    address: string,
    imageURL: string,
    longitude: number,
    latitude: number,
    distance?: number,
}

export interface IStoreDropdown {
    label: ReactElement,
    value: string,
}