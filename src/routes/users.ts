import { Application } from "express";
import { errorHandler } from "../common/errorHandler";
import { User } from "../db/models";
import { authMiddleware } from "../middleware";
import { IError, SERVICE_ERRORS } from "../types/errors";

export function userRoutes(app: Application) {
    app.delete("/users/:id", authMiddleware, async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            res.send(user);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.get("/users", authMiddleware, async (req, res) => {
        try {
            if (req.body.user) {
                return res.send(req.body.user);
            }
            const users = await User.find({});
            res.send(users);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.get("/users/:id", authMiddleware, async (req, res) => {
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

    app.patch("/users/:id", authMiddleware, async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            Object.entries(req.body).forEach(([key, value]) => {
                user[key] = value;
            });

            await user.save();

            res.send(user);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.post("/users/login", async (req, res) => {
        try {
            // @ts-ignore
            const user = await User.findByCredentials(
                req.body.email,
                req.body.password
            );

            const token = await user.generateAuthToken();

            res.send({ token, user });
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.post("/users/logout", authMiddleware, async (req, res) => {
        try {
            const { token, user } = req.body;
            const filteredUserTokens = user.tokens.filter(
                (t) => t.token !== token
            );
            const updatedUser = Object.assign(user, {
                tokens: filteredUserTokens,
            });
            await updatedUser.save();
            res.send(updatedUser);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.post("/users/logoutAll", authMiddleware, async (req, res) => {
        try {
            const { user } = req.body;
            const updatedUser = Object.assign(user, {
                tokens: [],
            });

            await updatedUser.save();
            res.send(updatedUser);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.post("/users", async (req, res) => {
        try {
            const user = new User(req.body);
            // @ts-ignore
            const token = await user.generateAuthToken();

            res.status(201).send({ token, user });
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });
}
