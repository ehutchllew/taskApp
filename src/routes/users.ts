import { Application } from "express";
import { errorHandler } from "../common/errorHandler";
import { User } from "../db/documents";
import { IError, SERVICE_ERRORS } from "../types/errors";

export function userRoutes(app: Application) {
    app.get("/users", async (req, res) => {
        try {
            const users = await User.find({});
            res.send(users);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.get("/users/:id", async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }
            res.send(user);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.patch("/users/:id", async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!user) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            res.send(user);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.post("/users", async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).send(user);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });
}
