import { z } from 'zod';

export const queryToolSchema = z.object({
  position: z.number().optional(),
  procedure: z.string().optional(),
  parameters: z.string().optional(),
  project_id: z.string().optional(),
  _id: z.string().optional(),
  limit: z.number().optional().default(10),
  page: z.number().optional().default(1),
  sort: z.object({
    position: z.number().optional(),
    procedure: z.number().optional(),
    parameters: z.number().optional(),
    project_id: z.number().optional(),
    _id: z.number().optional(),
  }).optional(),
});

export const buildQuery = ({ position, procedure, parameters, project_id, _id }) => {
  const query = {};

  if (position) {
    query.position = position;  
  }

  if (procedure) {
    query.procedure = { $regex: procedure, $options: 'i' };  
  }

  if (parameters) {
    query.parameters = { $regex: parameters, $options: 'i' };  
  }

  if (project_id) {
    query.project_id = project_id;  
  }

  if (_id) {
    query._id = _id;  
  }

  return query;
};

export const buildPagination = ({ page, limit }) => ({
  skip: (page - 1) * limit,
  limit,
});

export const buildSort = (sort) => {
  const sortObject = {};
  if (sort) {
    if (sort.position) sortObject.position = sort.position;
    if (sort.procedure) sortObject.procedure = sort.procedure;
    if (sort.parameters) sortObject.parameters = sort.parameters;
    if (sort.project_id) sortObject.project_id = sort.project_id;
    if (sort._id) sortObject._id = sort._id;
  }
  return sortObject;
};

