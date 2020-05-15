import { model } from "mongoose";
import { TaskSchema, UserSchema } from "./schemas";

export const Task = model("task", TaskSchema);
export const User = model("user", UserSchema);
