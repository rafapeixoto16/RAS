import { Router } from 'express';
import {
    updateProject,
    addProject,
    getProjects,
    deleteProject,
    getProject,
    validateSchema,
    projectSchema,
} from '../controller/project';
import { queryProjectSchema } from '../models/queryProject';

const router = Router();

router.post('/', async (req, res) => {
    const { body } = req;

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
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    const { query } = req;
    const validation = validateSchema(queryProjectSchema, query);
    if (validation.code !== 0) {
        return res.status(400).json(validation.errors);
    }

    try {
        const projects = await getProjects(query);
        if (!projects) {
            return res.status(404).json({ error: 'Projects not found' });
        }
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    // validate the body against the schema
    const validation = validateSchema(queryProjectSchema, body);
    if (validation.code !== 0) {
        return res.status(400).json(validation.errors);
    }

    try {
        const project = await updateProject(id, body);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const project = await deleteProject(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
