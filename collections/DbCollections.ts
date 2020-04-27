import { Collection, Db } from "mongodb";
import { CollectionTypes } from ".";
import { ITaskField, IUserField } from "./models";

type CollectionReturnType = {
    [CollectionTypes.TASKS]: ITaskField;
    [CollectionTypes.USERS]: IUserField;
};

export class DbCollections {
    constructor(private readonly db: Db) {}

    public collection<K extends CollectionTypes>(
        type: K
    ): Collection<CollectionReturnType[K]> {
        switch (type) {
            case CollectionTypes.TASKS:
                return this.db.collection(CollectionTypes.TASKS);
            case CollectionTypes.USERS:
                return this.db.collection(CollectionTypes.USERS);
        }
    }
}
