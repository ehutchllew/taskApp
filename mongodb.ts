import { MongoError, MongoClient } from "mongodb";
import { CollectionTypes, DbCollections } from "./collections";
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
        // db.collection(CollectionTypes.USERS).insertOne(
        //     {
        //         age: 29,
        //         name: "Evan",
        //     },
        //     (error, result) => {
        //         if (error) {
        //             console.log("UNABLE TO INSERT USER");
        //         }

        //         console.log(result.ops);
        //     }
        // );
    }
);

/**
 * TODO:
 * 1) Create abstractions around the available db.collections that are
 *    parameterized with `field` interfaces.
 * 2) Create said field interfaces -- i.e. IUsersField, ITasksField.
 * 3) When accessing a `users` collection we use the enum to serve it up and it
 *    is already parameterized with the interface via the abstraction.
 */
