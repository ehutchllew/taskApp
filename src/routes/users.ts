import { Application, Request, Response } from "express";
import multer from "multer";
import { adaptMulterError } from "../common/adaptMulterError";
import { errorHandler } from "../common/errorHandler";
import { parseFileType } from "../common/parseFileType";
import { User } from "../db/models";
import { authMiddleware, userGetMiddleware } from "../middleware";
import { IError, SERVICE_ERRORS } from "../types/errors";
import { acceptedFileTypes } from "../types/uploadFileTypes";

export function userRoutes(app: Application) {
    app.delete("/users/:id", authMiddleware, async (req, res) => {
        try {
            const user = req.user;

            if (!user) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            await user.remove();
            res.send(user);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.delete("/users/:id/avatar", authMiddleware, async (req, res) => {
        try {
            const user = req.user;

            if (!user) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            user.avatar = undefined;
            await req.user.save();
            res.send(user);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.get("/users", authMiddleware, userGetMiddleware, async (req, res) => {
        try {
            const users = await User.find({});
            res.send(users);
        } catch (e) {
            const err: IError = errorHandler(e);
            res.status(err.status).send(err);
        }
    });

    app.get(
        "/users/:id",
        authMiddleware,
        userGetMiddleware,
        async (req, res) => {
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
        }
    );

    app.get("/users/:id/avatar", async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user || !user.avatar) {
                throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
            }

            res.set("Content-Type", "image/jpg").send(user.avatar);
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

    app.post(
        "/users/avatar",
        authMiddleware,
        helpers.uploaderMiddleware,
        async (req, res) => {
            try {
                req.user.avatar = req.file.buffer;
                await req.user.save();
                res.sendStatus(204);
            } catch (e) {
                /**
                 * I don't think we even need this catch block as
                 * our error handling for multer is occurring in the
                 * custom middleware (see below).
                 */
                const err: IError = errorHandler(e);
                res.status(err.status).send(err);
            }
        }
    );

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
            const { token, user } = req;
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
            const { user } = req;
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

const helpers = {
    /**
     * Multer Uploader Ref
     */
    uploader: multer({
        fileFilter(req, file, cb) {
            const fileExtension: string = parseFileType(file.originalname);
            if (acceptedFileTypes.indexOf(fileExtension) < 0) {
                return cb({
                    name: SERVICE_ERRORS.UNSUPPORTED_FILETYPE,
                    message: `Supported file types are: ${acceptedFileTypes}`,
                });
            }

            cb(undefined, true);
        },
        limits: {
            fileSize: 1000000,
        },
    }).single("avatar"),

    /**
     * Error Handler for Above Mentioned Multer Uploader Ref
     * @param res express res
     * @param next express next
     * @param err multer error
     */
    uploaderErrorHandler(res, next, err) {
        if (err) {
            let error;
            if (err instanceof multer.MulterError) {
                error = errorHandler(adaptMulterError(err));
            }
            error = errorHandler(err);
            res.status(error.status).send(error);
        } else {
            next();
        }
    },

    /**
     * Milddeware Wrapper to capture errors ourselves
     * @param req express req
     * @param res express res
     * @param next express next
     */
    uploaderMiddleware(req, res, next) {
        helpers.uploader(
            req,
            res,
            helpers.uploaderErrorHandler.bind(null, res, next)
        );
    },
};
