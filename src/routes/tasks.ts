import { Application } from "express";
import { Task } from "../db/documents";

export function taskRoutes(app: Application) {
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
}
