import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Document, Error, Schema } from "mongoose";
import validator from "validator";
import { ITaskField, IUserField } from "../collections";
import { SERVICE_ERRORS } from "../types/errors";
import { ROLE } from "../types/role";
import { Task, User } from "./models";

export type ITaskDocument = Document & ITaskField;
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
    owner: {
        ref: "user",
        required: true,
        type: Schema.Types.ObjectId,
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
    role: {
        default: ROLE.USER,
        type: String,
    },
    tokens: [
        {
            token: {
                required: true,
                type: String,
            },
        },
    ],
});

UserSchema.virtual("tasks", {
    localField: "_id",
    foreignField: "owner",
    ref: "task",
});

UserSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ id: user._id.toString() }, "somesecretlel");

    user.tokens = [...user.tokens, { token }];

    await user.save();

    return token;
};

/**
 * `toJSON` is a side-effect that gets called when JSON.stringify is
 * invoked. Express is calling JSON.stringify for us when we
 * send back responses. This feature is not unique to mongoose.
 */
UserSchema.methods.toJSON = function () {
    const user = this;
    const userClone = user.toObject();

    delete userClone.password;
    delete userClone.role;
    delete userClone.tokens;

    return userClone;
};

UserSchema.statics.findByCredentials = async function (email, password) {
    const user = (await User.findOne({ email })) as IUserDocument;

    if (!user) {
        throw { message: "Unable to Login", name: SERVICE_ERRORS.FAILED_LOGIN };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw { message: "Unable to Login", name: SERVICE_ERRORS.FAILED_LOGIN };
    }

    return user;
};

UserSchema.pre<IUserDocument>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

UserSchema.pre<IUserDocument>("remove", async function (next) {
    const user = this;
    await Task.deleteMany({
        owner: user._id,
    });
    next();
});

export { TaskSchema, UserSchema };
