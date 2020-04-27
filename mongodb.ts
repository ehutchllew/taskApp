import { MongoError, MongoClient } from "mongodb";

const CONNECTION_URL = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "task-manager";

MongoClient.connect(
    CONNECTION_URL,
    {
        useNewUrlParser: true,
    },
    (error: MongoError, client: MongoClient) => {
        if (error) {
            return console.log("UNABLE TO CONNECT TO DB: \n", error);
        }
        console.log("~~CONNECTED TO DB CLIENT~~");

        const db = client.db(DATABASE_NAME);

        db.collection("users").insertOne({
            age: 29,
            name: "Evan",
        });
    }
);
