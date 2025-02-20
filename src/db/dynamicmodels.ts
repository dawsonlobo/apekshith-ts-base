import { Schema } from "mongoose";
import { ObjectId } from "mongodb";
import { getCollectionObject } from "../utils/v1/getmodel";
import { FilterQuery, Document } from "mongoose";
import logger from "../logger/v1/logger";

// Your other imports...

export const schema = new Schema({}, { strict: false, versionKey: false });
schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

export const add = (
  collectionName: string,
  data: object | object[],
   
  callBack: (error: Error | null, result: object | object[] | null | string[]) => void,
) => {
  getCollectionObject(collectionName, schema)
    .insertMany(data)
    .then(result => {
      callBack(null, result);
    })
    .catch(function (error) {
      callBack(error, null);
    });
};
type objectType = object | object[] | null;
export const addAwait = async (collectionName: string, data: objectType): Promise<void> => {
  await getCollectionObject(collectionName, schema).insertMany([data]);
};

export const updateOne = async (
  collectionName: string,
  id: string,
  data: objectType,
   
  callBack: (error: Error | null, result: objectType) => void,
) => {
  await getCollectionObject(collectionName, schema)
    .updateOne({ _id: new ObjectId(id) }, { $set: data }, { upsert: false })
    .then(result => {
      callBack(null, result);
    })
    .catch(function (error) {
      callBack(error, null);
    });
};

export const updateOneAwait = (
  collectionName: string,
  filter: FilterQuery<Document>,
  data: objectType,
  options: object,
) => {
  return getCollectionObject(collectionName, schema).updateOne(filter, { $set: data }, options);
};

export const updateManyAwait = (data: object, query: FilterQuery<Document>, collectionName: string) => {
  return getCollectionObject(collectionName, schema).updateMany(query, { $set: data }, { upsert: false });
};

export const deleteOneById = (
  id: string,
  collectionName: string,
   
  callBack: (error: Error | null, result: objectType) => void,
) => {
  getCollectionObject(collectionName, schema)
    .deleteOne({ _id: id })
    .then(result => {
      callBack(null, result);
    })
    .catch(function (error) {
      callBack(error, null);
    });
};

export const deleteOneAwait = async (collectionName: string, Id: string) => {
  return await getCollectionObject(collectionName, schema).deleteMany({ _id: Id }, {});
};

export const deleteQueryAwait = (collectionName: string, query: FilterQuery<Document>) => {
  return getCollectionObject(collectionName, schema).deleteOne(query);
};

export async function find(
  collectionName: string,
  query: FilterQuery<Document>,
  projection: object,
  options: object,
   
  callBack: (error: Error | null, result: objectType) => void,
) {
  return await getCollectionObject(collectionName, schema)
    .find(query, projection, options)
    .then(result => {
      callBack(null, result);
    })
    .catch(function (error) {
      callBack(error, null);
    });
}

export function findAwait(
  collectionName: string,
  query: FilterQuery<Document>,
  projection: object,
  options: object,
) {
  return getCollectionObject(collectionName, schema).find(query, projection, options);
}

export async function findOne(
  id: ObjectId,
  collectionName: string,
   
  callBack: (error: Error | null, result: objectType) => void,
) {
  return await getCollectionObject(collectionName, schema)
    .findById(id)
    .then(result => {
      callBack(null, result);
    })
    .catch(function (error) {
      callBack(error, null);
    });
}

export const findOneAwait = async (collectionName: string, id: ObjectId) => {
  return await getCollectionObject(collectionName, schema).findById(id).exec();
};

export function aggregateGeneral(collectionName: string, aggr: object[] | object) {
  // Ensure that aggr is always an array, even if it's a single object
  const pipeline = Array.isArray(aggr) ? aggr : [aggr];

  return getCollectionObject(collectionName, schema).aggregate(pipeline);
}

export function getDocumentCount(collectionName: string, query: object) {
  return getCollectionObject(collectionName, schema).estimatedDocumentCount(query);
}

export function getActualDocumentCount(collectionName: string, query: FilterQuery<Document>) {
  return getCollectionObject(collectionName, schema).countDocuments(query);
}

export const findOneAndUpdate = async function (
  collectionName: string,
  filter: FilterQuery<Document>,
  update: object, // Include _id as an optional property
  options: object,
) {
  return getCollectionObject(collectionName, schema).findOneAndUpdate(filter, update, options);
};

// New dynamic field setter function using positional operator
export const setFieldDynamically = async (
  collectionName: string,
  condition: FilterQuery<Document>,
  arrayFilter: object[],
  update: object,
   
  callBack: (error: Error | null, result: objectType) => void,
) => {
  await getCollectionObject(collectionName, schema)
    .updateMany(condition, { $set: update }, { arrayFilters: arrayFilter, upsert: false })
    .then(result => {
      callBack(null, result);
    })
    .catch(function (error) {
      callBack(error, null);
    });
};

// Function to update a document and return the updated document
export const updateOneAndGet = async (
  collectionName: string,
  filter: objectType,
  data: objectType,
): Promise<objectType | null> => {
  try {
    // Get the collection object
    const collection = await getCollectionObject(collectionName, schema);

    // Update the document based on the provided filter
    const updateResult = await collection.updateOne(filter, { $set: data }, { upsert: false });

    // Check if the update was successful
    if (updateResult.modifiedCount === 0) {
      return null;
    }

    // Fetch the updated document using the same filter
    const updatedDocument = await collection.findOne(filter);

    // Return the updated document
    return updatedDocument;
  } catch (error) {
    // Handle any error during the process
    logger.error("Error updating and fetching document:", error);
    throw new Error("Error updating and fetching the document");
  }
};

export const findByFieldAwait = async (
  collectionName: string,
  field: string, // The field name (e.g., 'orderNumber', 'userId', etc.)
  value: string | number | ObjectId | boolean, // The value of the field you're searching for
): Promise<objectType | null> => {
  try {
    const query = { [field]: value }; // Dynamically create the query object
    const result = await getCollectionObject(collectionName, schema).findOne(query);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const findOneDocumentAwait = async (collectionName: string, query: object) => {
  return await getCollectionObject(collectionName, schema).findOne(query).exec();
};
