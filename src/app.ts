import express, { Application } from "express";
import "./db/mongoose";
import { configureRoutes } from "./routes";

const app: Application = express();

app.use(express.json());

app.disable("x-powered-by");

configureRoutes(app);

export { app };
