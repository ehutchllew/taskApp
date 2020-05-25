import { MULTER_ERRORS, SERVICE_ERRORS } from "../types/errors";

export function adaptMulterError(err) {
    const errCopy = err;
    switch (err.code) {
        case MULTER_ERRORS.LIMIT_FILE_SIZE:
            errCopy.name = SERVICE_ERRORS.LIMIT_FILE_SIZE;
            return errCopy;
        default:
            return errCopy;
    }
}
