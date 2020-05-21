import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "../common/errorHandler";
import { User } from "../db/models";
import { IError, SERVICE_ERRORS } from "../types/errors";
import { ROLE } from "../types/role";

const userGetMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user.role !== ROLE.ADMIN) {
            return res.send(req.user);
        }
        next();
    } catch (e) {
        const err: IError = errorHandler(e);
        res.status(err.status).send(err);
    }
};

export { userGetMiddleware };
