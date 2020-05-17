import { Application } from "express";
import { errorHandler } from "../common/errorHandler";
import { Task } from "../db/documents";
import { IError, SERVICE_ERRORS } from "../types/errors";

export function taskRoutes(app: Application) {
    app.get("/tasks", async (req, res) => {
        try {
            const tasks = await Task.find({});
            res.send(tasks);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.get("/tasks/:id", async (req, res) => {
        try {
            const task = Task.findById(req.params.id);

            if (!task) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            res.send(task);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.post("/tasks", async (req, res) => {
        try {
            const task = new Task(req.body);
            await task.save();
            res.status(201).send(task);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });
}
