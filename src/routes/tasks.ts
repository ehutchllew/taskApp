import { Application, Request } from "express";
import { ITaskField } from "../collections";
import { errorHandler } from "../common/errorHandler";
import { Task } from "../db/models";
import { authMiddleware } from "../middleware";
import { IError, SERVICE_ERRORS } from "../types/errors";

export function taskRoutes(app: Application) {
    app.delete("/tasks/:id", authMiddleware, async (req, res) => {
        try {
            const task = await getUserTasks(req);

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
        const match: Partial<ITaskField> = {};
        if (req.query.completed) {
            match.completed = req.query.completed === "true";
        }

        if (req.query.description) {
            match.description = req.query.description as string;
        }

        try {
            const user = await req.user
                .populate({
                    match,
                    options: {
                        limit: parseInt(req.query.limit as string),
                        skip: parseInt(req.query.skip as string),
                    },
                    path: "tasks",
                })
                .execPopulate();
            res.send(user.tasks);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.get("/tasks/:id", authMiddleware, async (req, res) => {
        try {
            const task = await getUserTasks(req);

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
            const task = await getUserTasks(req);

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
            const task = new Task({ ...req.body, owner: req.user._id });
            await task.save();
            res.status(201).send(task);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });
}

function getUserTasks(req: Request) {
    return Task.findOne({
        _id: req.params.id,
        owner: req.user._id,
    });
}
