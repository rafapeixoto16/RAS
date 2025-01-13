import { Router } from 'express';
import {
    updateProject,
    addProject,
    getProjects,
    deleteProject,
    getProject,
    projectSchema,
    addTool,
    removeTool,
    reorderTool
} from '../controller/project.js';
import { queryProjectSchema } from '../models/queryProject.js';
import { validateRequest } from '@picturas/schema-validation';
import schemas from '../utils/filters.js';

const router = Router();

router.post('/', validateRequest({
    body: projectSchema,
    query: queryProjectSchema
}), async (req, res) => {
    const { body } = req;

    try {
        const project = await addProject(body);
        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to add project' });
    }
});

router.get('/:id', validateRequest({
    body: projectSchema,
    query: queryProjectSchema
}), async (req, res) => {
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

router.get('/', validateRequest({
    body: projectSchema,
    query: queryProjectSchema
}), async (req, res) => {
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

router.put('/:id', validateRequest({
    body: projectSchema,
    query: queryProjectSchema
}), async (req, res) => {
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

router.delete('/:id', validateRequest({
    body: projectSchema,
    query: queryProjectSchema
}), async (req, res) => {
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

// TODO: validate request
router.post('/:id/tool', validateRequest({
    // if the user is not premium and it tries to add a premium tool just send a 401
    body: schemaValidation.Object({
        filterName: schemaValidation.enum(Object.keys(schemas)),
        parameters: schemaValidation.unknown(),
    }).refine((data) => schemas[data.filterName].safeParse(data.parameters).success)
}), async (req, res) => {
    const { id } = req.params;
    const toolInformation = req.body;

    try {
        const { project, index } = await addTool(id, toolInformation);
        return res.status(200).json({
            project,
            index
        })
    } catch(error) {
        return res.status(500).json({ error: error.message });
    } 
})

// TODO: validate request
router.delete('/:id/tool/:idxTool', validateRequest({}), async (req, res) => {
    const { id, idxTool } = req.params;

    try {
        const { project, removedTool } = await removeTool(id, idxTool);
        return res.status(200).json({
            project,
            removedTool
        });
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
})

router.put('/:id/tool/:idxTool', validateRequest({}), async (req, res) => {
    const { idxTool } = req.params;
})

export default router;
