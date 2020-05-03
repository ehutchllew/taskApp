import { connect, model, Schema } from "mongoose";

connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
    useCreateIndex: true,
});

const userSchema = new Schema({
    age: {
        type: Number,
    },
    name: {
        type: String,
    },
});

const User = model("User", userSchema);

const me = new User({
    age: 29,
    name: "Evan",
});

me.save()
    .then((resp) => {
        console.log(resp);
    })
    .catch((error) => {
        console.log("Error!\n", error);
    });
