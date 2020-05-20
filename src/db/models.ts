import { model } from "mongoose";
import {
    ITaskDocument,
    IUserDocument,
    TaskSchema,
    UserSchema,
} from "./schemas";

export const Task = model<ITaskDocument>("task", TaskSchema);
export const User = model<IUserDocument>("user", UserSchema);
