# Task App

## Mongo CRUD examples

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
