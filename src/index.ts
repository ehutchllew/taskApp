import express, { Application } from "express";
import "./db/mongoose";
import { configureRoutes } from "./routes";

const app: Application = express();
const PORT = process.env.port || 3001;

app.use(express.json());

app.disable("x-powered-by");

configureRoutes(app);

app.listen(PORT, () => {
    console.log("Server connected on: ", PORT);
});
