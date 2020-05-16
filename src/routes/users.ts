import { Application } from "express";
import { User } from "../db/documents";

export function userRoutes(app: Application) {
    app.get("/users", (req, res) => {
        User.find({})
            .then((resp) => {
                res.send(resp);
            })
            .catch((e) => {
                res.status(500).send(e);
            });
    });

    app.get("/users/:id", (req, res) => {
        User.findById(req.params.id)
            .then((resp) => {
                res.send(resp);
            })
            .catch((e) => {
                res.status(404).send(e);
            });
    });

    app.post("/users", (req, res) => {
        const user = new User(req.body);

        user.save()
            .then(() => {
                res.status(201).send(user);
            })
            .catch((e) => {
                res.status(400).send(e);
            });
    });
}
