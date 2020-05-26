import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "../common/errorHandler";
import { User } from "../db/models";
import { IError, SERVICE_ERRORS } from "../types/errors";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw { name: SERVICE_ERRORS.INVALID_TOKEN };
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({
            _id: decoded.id,
            "tokens.token": token,
        });

        if (!user) {
            throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        const err: IError = errorHandler(e);
        res.status(err.status).send(err);
    }
};

export { authMiddleware };
