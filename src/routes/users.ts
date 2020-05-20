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
            // const { token, user } = req.body;
            // const filteredUserTokens = user.tokens.filter((t) => t !== token);
            // const updatedUser = { ...user, tokens: filteredUserTokens };

            // await updatedUser.save();
            // res.send(updatedUser);
            req.body.user.tokens = req.body.user.tokens.filter(
                (t) => t.token !== req.body.token
            );

            await req.body.user.save();
            res.send(req.body.user);
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
