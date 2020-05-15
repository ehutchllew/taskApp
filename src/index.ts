import express, { Application } from "express";
import "./db/mongoose";
import { model } from "mongoose";
import { UserSchema, TaskSchema } from "./db/schemas";

const app: Application = express();
const PORT = process.env.port || 3001;

app.use(express.json());

app.post("/users", (req, res) => {
    const User = model("user", UserSchema);
    const user = new User(req.body);

    user.save()
        .then(() => {
            res.status(201).send(user);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

app.post("/tasks", (req, res) => {
    const Task = model("task", TaskSchema);
    const task = new Task(req.body);

    task.save()
        .then(() => {
            res.status(201).send(task);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

app.listen(PORT, () => {
    console.log("Server connected on: ", PORT);
});
