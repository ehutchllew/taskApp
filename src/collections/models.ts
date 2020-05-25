import { ObjectId } from "mongodb";
import { ROLE } from "../types/role";

interface IBaseField {
    _id: string | number | ObjectId;
}

export interface ITaskField extends IBaseField {
    completed: boolean;
    description: string;
    owner: ObjectId;
}
export interface IUserField extends IBaseField {
    age: number;
    email: string;
    name: string;
    password: string;
    role: ROLE;
    tasks?: ITaskField[];
    tokens: { _id: ObjectId; token: string }[];
}
