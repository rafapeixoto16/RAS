import { z } from 'zod';

export const queryProjectSchema = z.object({
  name: z.string().optional(),
  user_id: z.string().optional(),
  _id: z.string().optional(),
  limit: z.number().optional().default(10),
  page: z.number().optional().default(1),
  sort: z.object({
    name: z.number().optional(),
    user_id: z.number().optional(),
    _id: z.number().optional(),
  }).optional(),
});

// in case the model changes, we might need to update this function
export const buildQuery = ({ name, user_id, _id }) => {
  const query = {};
  
  if (name) {
    query.name = { $regex: name, $options: 'i' }; // Case-insensitive search for 'name'
  }

  if (user_id) {
    query.user_id = user_id; 
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
    if (sort.name) sortObject.name = sort.name;
    if (sort.user_id) sortObject.user_id = sort.user_id;
    if (sort._id) sortObject._id = sort._id;
  }
  return sortObject;
};

