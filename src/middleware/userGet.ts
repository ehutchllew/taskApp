import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../common/errorHandler";
import { IError } from "../types/errors";
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
