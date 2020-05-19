import { ObjectId } from "mongodb";

interface IBaseField {
    _id: string | number | ObjectId;
}

export interface ITaskField extends IBaseField {
    complete: boolean;
    description: string;
}
export interface IUserField extends IBaseField {
    age: number;
    email: string;
    name: string;
    password: string;
}
