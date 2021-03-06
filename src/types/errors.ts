export interface IError {
    message: string;
    name: string;
    stack?: any;
    status: number;
    [k: string]: any;
}

export enum SERVICE_ERRORS {
    CAST = "CastError",
    DOCUMENT_NOT_FOUND = "DocumentNotFoundError",
    FAILED_LOGIN = "FailedLogin",
    INVALID_TOKEN = "JsonWebTokenError",
    LIMIT_FILE_SIZE = "LimitFileSize",
    PARALLEL_SAVE = "ParallelSaveError",
    UNSUPPORTED_FILETYPE = "UnsupportedFileType",
    VALIDATION = "ValidationError",
}

export enum MULTER_ERRORS {
    LIMIT_FILE_SIZE = "LIMIT_FILE_SIZE",
}
