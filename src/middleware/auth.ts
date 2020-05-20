import jwt from "jsonwebtoken";
import { errorHandler } from "../common/errorHandler";
import { User } from "../db/models";
import { IError, SERVICE_ERRORS } from "../types/errors";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw { name: SERVICE_ERRORS.INVALID_TOKEN };
        }

        const decoded = jwt.verify(token, "somesecretlel");
        const user = await User.findOne({
            _id: decoded.id,
            "tokens.token": token,
        });

        if (!user) {
            throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
        }
        req.body.token = token;
        req.body.user = user;
        next();
    } catch (e) {
        const err: IError = errorHandler(e);
        res.status(err.status).send(err);
    }
};

export { authMiddleware };
