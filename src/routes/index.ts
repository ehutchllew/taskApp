import { Application } from "express";
import { taskRoutes } from "./tasks";
import { userRoutes } from "./users";

export function configureRoutes(app: Application) {
    taskRoutes(app);
    userRoutes(app);
}
