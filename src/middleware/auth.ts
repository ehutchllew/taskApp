import jwt from "jsonwebtoken";
import { User } from "../db/models";
import { IError, SERVICE_ERRORS } from "../types/errors";
import { errorHandler } from "../common/errorHandler";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "somesecretlel");
        const user = await User.findOne({
            _id: decoded.id,
            "tokens.token": token,
        });

        if (!user) {
            throw { name: SERVICE_ERRORS.DOCUMENT_NOT_FOUND };
        }

        req.user = user;
        next();
    } catch (e) {
        const err: IError = errorHandler(e);
        res.status(err.status).send(err);
    }
};

export { authMiddleware };
