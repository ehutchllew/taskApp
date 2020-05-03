import { MongoClient, MongoError, ObjectId } from "mongodb";
import { CollectionTypes, DbCollections } from "./src/collections";
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

        const db = new DbCollections(client.db(DATABASE_NAME));
    }
);
