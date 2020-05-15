import { connect, model } from "mongoose";
import { UserSchema } from "./schemas";

connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
    useCreateIndex: true,
});

// const User = model("User", UserSchema);

// const me = new User({
//     age: 11,
//     email: "aasdf@email.com ",
//     name: "  ABC ",
// });

// me.save()
//     .then((resp) => {
//         console.log(resp);
//     })
//     .catch((error) => {
//         console.log("Error!\n", error);
//     });
