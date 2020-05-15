import express, { Application } from "express";
import { Task, User } from "./db/documents";
import "./db/mongoose";

const app: Application = express();
const PORT = process.env.port || 3001;

app.use(express.json());

app.get("/users", (req, res) => {
    User.find({})
        .then((resp) => {
            res.send(resp);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});

app.get("/users/:id", (req, res) => {
    User.findById(req.params.id)
        .then((resp) => {
            res.send(resp);
        })
        .catch((e) => {
            res.status(404).send(e);
        });
});

app.post("/users", (req, res) => {
    const user = new User(req.body);

    user.save()
        .then(() => {
            res.status(201).send(user);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

app.get("/tasks", (req, res) => {
    Task.find({})
        .then((resp) => {
            res.send(resp);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});

app.get("/tasks/:id", (req, res) => {
    Task.findById(req.params.id)
        .then((resp) => {
            res.send(resp);
        })
        .catch((e) => {
            res.status(404).send(e);
        });
});

app.post("/tasks", (req, res) => {
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
