import { Application } from "express";
import { errorHandler } from "../common/errorHandler";
import { Task } from "../db/models";
import { authMiddleware } from "../middleware";
import { IError, SERVICE_ERRORS } from "../types/errors";

export function taskRoutes(app: Application) {
    app.delete("/tasks/:id", authMiddleware, async (req, res) => {
        try {
            const task = await Task.findByIdAndDelete(req.params.id);

            if (!task) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            res.send(task);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.get("/tasks", authMiddleware, async (req, res) => {
        try {
            const tasks = await Task.find({});
            res.send(tasks);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.get("/tasks/:id", authMiddleware, async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);

            if (!task) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            res.send(task);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.patch("/tasks/:id", authMiddleware, async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);

            if (!task) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            Object.entries(req.body).forEach(([key, value]) => {
                task[key] = value;
            });

            await task.save();

            res.send(task);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.post("/tasks", authMiddleware, async (req, res) => {
        try {
            const task = new Task({ ...req.body, owner: req.body.user._id });
            await task.save();
            res.status(201).send(task);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });
}
