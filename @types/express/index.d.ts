import { Express } from "express-serve-static-core";
import { IUserDocument } from "../../src/db/schemas";

declare module "express-serve-static-core" {
    interface Request {
        file?: { buffer: Buffer };
        token?: string;
        user?: IUserDocument;
    }
}
