import { Router } from 'express';
import {
    updateProject,
    addProject,
    getProjects,
    deleteProject,
    getProject,
    projectSchema,
} from '../controller/project.js';
import { queryProjectSchema } from '../models/queryProject.js';
import { validateRequest } from '@picturas/schema-validation';

const router = Router();
router.use(
    validateRequest({
        body: projectSchema,
        query: queryProjectSchema,
    })
);

router.post('/', async (req, res) => {
    const { body } = req;

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
