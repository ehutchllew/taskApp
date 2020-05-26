import { connect } from "mongoose";

connect(process.env.DB_HOST_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
});
