# Task App

## Mongo CRUD examples

### Creating

```ts
const db = new DbCollections(client.db(DATABASE_NAME));
db.collection(CollectionTypes.TASKS).insertMany(
    [
        {
            complete: false,
            description: "desc1",
        },
        {
            complete: false,
            description: "desc2",
        },
    ],
    (error, result) => {
        // Handle this
    }
);
```

### Reading

`find` returns a [`Cursor`](https://mongodb.github.io/node-mongodb-native/3.6/api/Cursor.html)

```ts
const db = new DbCollections(client.db(DATABASE_NAME));
db.collection(CollectionTypes.USERS)
    .find({ age: 29 })
    .toArray((error, users) => {});
```

### Updating

```ts
const db = new DbCollections(client.db(DATABASE_NAME));
db.collection(CollectionTypes.USERS)
    .findOneAndUpdate(
        {
            age: 30,
        },
        {
            $inc: {
                age: -1,
            },
        },
        {
            returnOriginal: false,
        }
    )
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
```

### Deleting

Look for the `deleteCount` prop on the response object.

```ts
const db = new DbCollections(client.db(DATABASE_NAME));
db.collection(CollectionTypes.USERS)
    .deleteOne({
        _id: new ObjectId("5ea752195f575942a4af115e"),
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => console.log(err));
```

## Mongoose Examples

### Creating Models

```ts
export type IUserDocument = Document & IUserField;
const UserSchema = new Schema({
    age: {
        type: Number,
    },
    name: {
        type: String,
    },
});

const User = model<IUserDocument>("User", UserSchema);
```

### Creating Relational Documents/Tables

```ts
const TaskSchema = new Schema({
    ...otherData,
    owner: {
        ref: "User", // name of model to relate to, see: `Creating Models`.
        required: true,
        type: Schema.Types.ObjectId,
    },
});
```

Then when setting the data make sure to set the `owner` prop like so:

```ts
/*
 * req.body.user is being set in the `authMiddleware` -- we're
 * actively setting it when the token is authorized so we can use
 * this object -- so this gets passed in as part of the body.
 */
const task = new Task({ ...req.body, owner: req.body.user._id });
```

If we want to use the `owner` id on a Task to grab the actual relational
object then we need to use `populate` and `execPopulate` like such:

```ts
const task = await Task.findById("5ec59a8c0e1a450af44ac692");
await task.populate("owner").execPopulate();
console.log(task.owner); // task.owner contains the entire User object
```

### Creating Virtual Properties

```ts
UserSchema.virtual("tasks", {
    localField: "_id", // The local prop that is equal to the foreign prop.
    foreignField: "owner", // Field on relational data that creates the relation, see: `Creating Relational Documents/Tables`
    ref: "Task", // name of model to relate to, see: `Creating Models`.
});
```

Like with populating the `task.owner` prop we can grab all associated tasks
to the user by:

```ts
const user = await User.findById("5ec599d030e9ca40acd58c6b");
await user.populate("tasks").execPopulate();
console.log(user.tasks); // shows all tasks who's owner prop === user._id prop
```
