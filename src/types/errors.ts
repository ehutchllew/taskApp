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
    PARALLEL_SAVE = "ParallelSaveError",
    VALIDATION = "ValidationError",
}
