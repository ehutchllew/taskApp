const request = require("supertest");
const { app } = require("../src/app");

describe("users test suite", () => {
    afterAll(() => {});

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
