import express, { Application } from "express";
import { Task, User } from "./db/documents";
import "./db/mongoose";
import { configureRoutes } from "./routes";

const app: Application = express();
const PORT = process.env.port || 3001;

app.use(express.json());

configureRoutes(app);

app.listen(PORT, () => {
    console.log("Server connected on: ", PORT);
});
