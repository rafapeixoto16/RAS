import * as Tool from '../models/toolModel.js';
import { buildPagination, buildSort, buildQuery } from '../models/queryTool.js';
import { z } from 'zod';

// Zod schema for validating tool data
export const toolSchema = z.object({
  position: z.number().min(1, 'Position is required'),  
  procedure: z.string().min(1, 'Procedure is required'),
  parameters: z.string().min(1, 'Parameters are required'),
  project_id: z.string().uuid('Invalid project ID'), 
});

// returns 0 if validation is successful, otherwise -1 and an array of errors
export function validateSchema(schema, data) {
  const result = schema.safeParse(data);
  return !result.success
    ? {
        code: -1,
        errors: result.error.issues.map((issue) => issue.message),
      }
    : {
        code: 0,
        data: result.data,
      };
}

export const getTool = (id) => {
  return Tool.findOne({ _id: id }).exec();
};

export const getTools = (query) => {
  const { page, limit, sort } = query;
  const pagination = buildPagination({ page, limit });
  const sortObject = buildSort(sort);
  const queryObject = buildQuery(query);  // Assuming query can have fields like 'position', 'procedure', 'project_id', etc.
  return Tool.find(queryObject)
    .sort(sortObject)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .exec();
};

export const addTool = (toolData) => {
  return new Tool(toolData).save();
};

export const updateTool = (id, info) => {
  return Tool.updateOne({ _id: id }, info).exec();
};

export const deleteTool = (id) => {
  return Tool.deleteOne({ _id: id }).exec();
};

export const deleteAllTools = () => {
  return Tool.deleteMany().exec();
};

