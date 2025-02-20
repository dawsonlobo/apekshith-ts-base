
import {
  IFilter,
  IOptions,
  IProject,
  ISearch,
} from "../../utils/v1/customTypes";
import logger from "../../logger/v1/logger";
import { ObjectId } from "bson";
import { isArray, isObject } from "lodash";







export function searchingWithMultiSearch(search: ISearch[]) {
  const aggr: object[] = [];
  const andConditions: object[] = [];

  if (search?.length > 0) {
    for (const element of search) {
      const { term, endsWith, fields, startsWith } = element;
      // Escape special characters in the term
      const escapedTerm = term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      // Construct the regex based on conditions
      let regex: RegExp;
      if (startsWith && endsWith) {
        regex = new RegExp(`^${escapedTerm}$`, "i");
      } else if (startsWith) {
        regex = new RegExp(`^${escapedTerm}`, "i");
      } else if (endsWith) {
        regex = new RegExp(`${escapedTerm}$`, "i");
      } else {
        regex = new RegExp(escapedTerm, "i");
      }

      // Construct the $or condition for fields
      const orConditions: object[] = fields.map(field => ({
        [field]: { $regex: regex },
      }));

      // Combine $or conditions for this search object
      if (orConditions.length > 0) {
        andConditions.push({ $or: orConditions });
      }
    }

    // Combine all $or conditions with $and
    if (andConditions.length > 0) {
      aggr.push({
        $match: {
          $and: andConditions,
        },
      });
    }
  }

  logger.info("Generated Aggregation For Search:", JSON.stringify(aggr, null, 2));

  return aggr;
}




export function searchApiInput(payload: {
  options?: IOptions;
  search?: ISearch;
  filter?: IFilter;
  project?: IProject;
}) {
  const options: IOptions = payload?.options && isObject(payload.options) ? payload.options : {};
  const search: ISearch = payload?.search && isObject(payload.search) ? payload.search : {};
  const filter: IFilter = payload?.filter && isObject(payload.filter) ? payload.filter : {};
  const project: IProject = payload?.project && isObject(payload.project) ? payload.project : {};
  const searchTerm: string = search?.term ? search?.term : "";
  const searchFields: string[] = search?.fields ? search.fields : [];
  const page: number = options?.page && parseInt(options?.page) > 0 ? parseInt(options.page) : 1;
  const itemsPerPage: number =
    options?.itemsPerPage && parseInt(options?.itemsPerPage) > 0 ? parseInt(options.itemsPerPage) : 0;
  const skip: number = (page - 1) * itemsPerPage;
  return { filter, project, searchFields, searchTerm, skip, options, itemsPerPage };
}




export function searchApiInputWithMultiSearch (payload: {
  options?: IOptions;
  search?: ISearch[];
  filter?: IFilter;
  project?: IProject;
}) {
  const options: IOptions = payload?.options && isObject(payload.options) ? payload.options : {};
  const search: ISearch[] = payload?.search && isArray(payload.search) ? payload.search : [];
  const filter: IFilter = payload?.filter && isObject(payload.filter) ? payload.filter : {};
  const project: IProject = payload?.project && isObject(payload.project) ? payload.project : {};
  const page: number = options?.page && parseInt(options?.page) > 0 ? parseInt(options.page) : 1;
  const itemsPerPage: number =
    options?.itemsPerPage && parseInt(options?.itemsPerPage) > 0 ? parseInt(options.itemsPerPage) : 0;
  const skip: number = (page - 1) * itemsPerPage;
  return { filter, project, search, skip, options, itemsPerPage };
}




export function filtering(filter: IFilter, keys: string[]) {
  const aggr: object[] = [];
  const andFilter: object[] = [];
  for (const key in filter) {
    if (filter[key].length === 0 || (filter[key].length === 1 && filter[key][0] === "")) {
      // Handle empty array or array with empty string to fetch all stakeholders
      andFilter.push({}); // Add an empty filter to include all stakeholders
    } else {
      const orFilter: object[] = [];
      for (const value of filter[key]) {
        const temp: { [key: string]: string | number | object } = {};
        if (keys.includes(key)) {
          temp[key] = new ObjectId(value as string); // Convert string ID to ObjectId for specified keys
        } else {
          temp[key] = value;
        }
        orFilter.push(temp);
      }
      andFilter.push({ $or: orFilter });
    }
  }

  aggr.push({
    $match: {
      $and: andFilter,
    },
  });

  return aggr;
}




export function aggregationForSearchApi(options: IOptions, skip: number, project: IProject) {
    const aggr: object[] = [];
    if (options?.sortBy?.length) {
        const sortFields: { [key: string]: number } = {};

        for (let x = 0; x < options.sortBy.length; x++) {
            const fieldName = options.sortBy[x];
            const sortDirection = options.sortDesc[x] === true ? -1 : 1;

            // Create a new field with lowercase values for sorting
            const lowercaseField = `${fieldName}_lowercase`;

            aggr.push({
                $addFields: {
                    [lowercaseField]: {
                        $cond: {
                            if: { $eq: [{ $type: `$${fieldName}` }, "string"] },
                            then: { $toLower: `$${fieldName}` },
                            else: {
                                $cond: {
                                    if: { $eq: [{ $type: `$${fieldName}` }, "bool"] },
                                    then: { $toString: `$${fieldName}` },
                                    else: `$${fieldName}`,
                                },
                            },
                        },
                    },
                },
            });

            // Sort based on the lowercase field
            sortFields[lowercaseField] = sortDirection;
        }

        // Add the $sort stage using the lowercase field
        aggr.push({ $sort: sortFields });

        // Project to exclude the lowercase fields from the final response
        const projectFields: { [key: string]: 0 } = {};
        for (const field in sortFields) {
            projectFields[field] = 0;
        }
        aggr.push({ $project: projectFields });
    }

    if (Object.keys(project)?.length) {
        aggr.push({
            $project: {
                ...project,
            },
        });
    }
    if (skip != 0) {
        aggr.push({
            $skip: skip,
        });
    }
    return aggr;
}
