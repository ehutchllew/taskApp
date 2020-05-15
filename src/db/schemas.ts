import { Schema } from "mongoose";
import validator from "validator";

export const TaskSchema = new Schema({
    completed: {
        default: false,
        type: Boolean,
    },
    description: {
        required: true,
        trim: true,
        type: String,
    },
});

export const UserSchema = new Schema({
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be above 0");
            }
            return true;
        },
    },
    email: {
        lowercase: true,
        required: true,
        trim: true,
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid e-mail");
            }
            return true;
        },
    },
    name: {
        required: true,
        trim: true,
        type: String,
    },
    password: {
        minlength: 7,
        required: true,
        trim: true,
        type: String,
        validate(value) {
            if (value.includes("password")) {
                throw new Error("Password cannot contain 'password'");
            }
            return true;
        },
    },
});
