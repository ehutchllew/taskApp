const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { app } = require("../src/app");
const { User } = require("../src/db/models");

describe("users test suite", () => {
    describe("clean DB for each test", () => {
        beforeEach(async () => {
            await User.deleteMany();
        });

        it("should signup a new user", async () => {
            const response = await request(app)
                .post("/users")
                .send({
                    name: "Joe Shmoe",
                    email: "joeylackatoey@email.com",
                    password: "Test1234!",
                })
                .expect(201);
            const user = await User.findById(response.body.user._id);
            expect(user).toBeTruthy();

            expect(response.body).toMatchObject({
                user: {
                    name: "Joe Shmoe", // or user.name?,
                    email: "joeylackatoey@email.com",
                },
                token: user.tokens[0].token,
            });

            expect;
        });

        it("should not store the plaintext password", async () => {
            const response = await request(app)
                .post("/users")
                .send({
                    name: "Joe Shmoe",
                    email: "joeylackatoey@email.com",
                    password: "Test1234!",
                })
                .expect(201);

            const user = await User.findById(response.body.user._id);

            expect(user.password).not.toBe("Test1234!");
        });
    });

    describe("persist user for each test", () => {
        const correctUserId = new mongoose.Types.ObjectId();
        const correctUser = {
            _id: correctUserId,
            name: "Will.I.Am.",
            email: "bep@email.com",
            password: "Test1234!",
            tokens: [
                {
                    token: jwt.sign(
                        { id: correctUserId },
                        process.env.JWT_SECRET_KEY
                    ),
                },
            ],
        };
        const invalidPasswordUser = {
            name: "Will.I.Am.",
            email: "bep@email.com",
            password: "Test1",
        };
        beforeAll(async () => {
            await new User(correctUser).save();
        });
        afterAll(async () => {
            await User.deleteMany();
        });

        it("should fail to create user when password is too short", async () => {
            await request(app)
                .post("/users")
                .send(invalidPasswordUser)
                .expect(400);
        });

        it("should login existing user", async () => {
            const response = await request(app)
                .post("/users/login")
                .send({
                    email: correctUser.email,
                    password: correctUser.password,
                })
                .expect(200);

            const user = await User.findById(response.body.user._id);

            expect(user.tokens[1].token).toEqual(response.body.token);
        });

        it("should allow the user to upload an avatar image", async () => {
            await request(app)
                .post(`/users/avatar`)
                .set("Authorization", `Bearer ${correctUser.tokens[0].token}`)
                .attach("avatar", "__tests__/fixtures/passport_photo.jpg")
                .expect(204);

            const user = await User.findById(correctUserId);
            expect(user.avatar).toEqual(expect.any(Buffer));
        });

        it("should not allow login on incorrect password", async () => {
            await request(app)
                .post("/users/login")
                .send({
                    email: correctUser.email,
                    password: "Testt1234!",
                })
                .expect(401);
        });

        it("should get the current user's profile", async () => {
            await request(app)
                .get("/users")
                .set("Authorization", `Bearer ${correctUser.tokens[0].token}`)
                .send()
                .expect(200);
        });

        it("should not allow getting an account if there is no valid token", async () => {
            await request(app).get("/users").send().expect(401);
        });

        it("should allow the user to delete themselves if a valid token exists.", async () => {
            const response = await request(app)
                .delete("/users/" + correctUserId)
                .set("Authorization", `Bearer ${correctUser.tokens[0].token}`)
                .send()
                .expect(200);
            const user = await User.findById(response.body._id);

            expect(user).toBeNull();
        });
    });
});
