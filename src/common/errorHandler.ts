import { Error } from "mongoose";
import { IError, SERVICE_ERRORS } from "../types/errors";

export function errorHandler(err: Error): IError {
    const errorMap: IError = {
        message: err.message,
        name: err.name,
        status: 500,
        ...err,
    };

    switch (err.name) {
        case SERVICE_ERRORS.CAST:
        case SERVICE_ERRORS.VALIDATION:
            errorMap.status = 400;
            break;
        case SERVICE_ERRORS.DOCUMENT_NOT_FOUND:
            errorMap.status = 404;
            break;
        case SERVICE_ERRORS.FAILED_LOGIN:
            errorMap.status = 401;
            break;
        case SERVICE_ERRORS.PARALLEL_SAVE:
            errorMap.status = 409;
            break;
        default:
            errorMap.status = 500;
            break;
    }

    return errorMap;
}
