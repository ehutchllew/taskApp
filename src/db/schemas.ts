import bcrypt from "bcryptjs";
import { Document, Schema, Error } from "mongoose";
import validator from "validator";
import { IUserField } from "../collections";
import { User } from "./models";

export type IUserDocument = Document & IUserField;

const TaskSchema = new Schema({
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

const UserSchema = new Schema({
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
        unique: true,
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

UserSchema.statics.findByCredentials = async function (email, password) {
    const user = (await User.findOne({ email })) as IUserDocument;

    if (!user) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
};

UserSchema.pre<IUserDocument>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

export { TaskSchema, UserSchema };
