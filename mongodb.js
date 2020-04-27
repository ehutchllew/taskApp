const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const CONNECTION_URL = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "task-manager";

MongoClient.connect(
    CONNECTION_URL,
    {
        useNewUrlParser: true,
    },
    (error, client) => {
        if (error) {
            return console.log("UNABLE TO CONNECT TO DB: \n", error);
        }
        console.log("~~CONNECTED TO DB CLIENT~~");
    }
);
