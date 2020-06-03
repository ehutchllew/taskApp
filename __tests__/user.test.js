const request = require("supertest");
const { app } = require("../src/app");
const { User } = require("../src/db/models");

describe("users test suite", () => {
    describe("clean DB for each test", () => {
        beforeEach(async () => {
            await User.deleteMany();
        });

        it("should signup a new user", async () => {
            await request(app)
                .post("/users")
                .send({
                    name: "Joe Shmoe",
                    email: "joeylackatoey@email.com",
                    password: "Test1234!",
                })
                .expect(201);
        });
    });

    describe("persist user for each test", () => {
        const correctUser = {
            name: "Will.I.Am.",
            email: "bep@email.com",
            password: "Test1234!",
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
            await User.deleteMany;
        });

        it("should fail to create user when password is too short", async () => {
            await request(app)
                .post("/users")
                .send(invalidPasswordUser)
                .expect(400);
        });

        it("should login existing user", async () => {
            await request(app)
                .post("/users/login")
                .send({
                    email: correctUser.email,
                    password: correctUser.password,
                })
                .expect(200);
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
    });
});
