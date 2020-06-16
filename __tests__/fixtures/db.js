const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Task, User } = require("../../src/db/models");

const correctUserId = new mongoose.Types.ObjectId();
const correctUser = {
    _id: correctUserId,
    name: "Will.I.Am.",
    email: "bep@email.com",
    password: "Test1234!",
    tokens: [
        {
            token: jwt.sign({ id: correctUserId }, process.env.JWT_SECRET_KEY),
        },
    ],
};

const setupDB = async () => {
    await new User(correctUser).save();
};

const tearDownDB = async () => {
    await User.deleteMany();
    await Task.deleteMany();
};

it("setting up db", () => {});

module.exports = { correctUser, correctUserId, setupDB, tearDownDB };
