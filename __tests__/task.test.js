const request = require("supertest");
const { app } = require("../src/app");
const { correctUser, setupDB, tearDownDB } = require("./fixtures/db");
const { Task } = require("../src/db/models");

describe("tasks test suite", () => {
    beforeAll(setupDB);
    afterAll(tearDownDB);
    describe("existing user tasks", () => {
        it("should allow the user to make a task", async () => {
            const response = await request(app)
                .post("/tasks")
                .set("Authorization", `Bearer ${correctUser.tokens[0].token}`)
                .send({
                    description: "Some Task LOLOL",
                })
                .expect(201);

            const task = await Task.findById(response.body._id);
            expect(task).toBeTruthy();
        });
    });
});
