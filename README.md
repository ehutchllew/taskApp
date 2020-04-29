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
