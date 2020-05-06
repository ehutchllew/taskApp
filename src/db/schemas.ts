import { Schema } from "mongoose";

export const TaskSchema = new Schema({
    completed: {
        type: Boolean,
    },
    description: {
        type: String,
    },
});

export const UserSchema = new Schema({
    age: {
        type: Number,
    },
    name: {
        type: String,
    },
});
