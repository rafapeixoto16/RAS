import { Router } from 'express';
import { addProject, getProjects, deleteProject, getProject, validateSchema, } from '../controller/project.js';
import { projectSchema } from '../controller/project.js';

const router = Router();

router.post('/', async (req, res) => {
  const body = req.body;

  // validate the body against the schema
  const validation = validateSchema(projectSchema, body);
  if (validation.code !== 0) {
    return res.status(400).json(validation.errors);
  }

  try {
    const project = await addProject(body);
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add project' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const project = await getProject(id);
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const query = req.query;
  const validation = validateSchema(querySchema, query);
  if (validation.code !== 0) {
    return res.status(400).json(validation.errors);
  }

  try {
    const projects = await getProjects(query);
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  // validate the body against the schema
  const validation = validateSchema(projectSchema, body);
  if (validation.code !== 0) {
    return res.status(400).json(validation.errors);
  }

  try {
    const project = await updateProject(id, body);
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await deleteProject(id);
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default projectRouter;
