export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    phoneNumber: string;
    gender: Gender;
    isAdmin: boolean;
}

export enum Gender {
    MALE = "Male",
    FEMALE = "Female",
    OTHER = "Other"
}