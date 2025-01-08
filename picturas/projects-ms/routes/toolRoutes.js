import { Router } from 'express';
import {
    addTool,
    getTools,
    deleteTool,
    getTool,
    updateTool,
    validateSchema,
    toolSchema,
} from '../controller/tool';
import { queryToolSchema } from '../models/queryTool';

const router = Router();

router.post('/', async (req, res) => {
    const { body } = req;

    const validation = validateSchema(toolSchema, body);
    if (validation.code !== 0) {
        return res.status(400).json(validation.errors);
    }

    try {
        const tool = await addTool(body);
        return res.status(200).json(tool);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to add tool' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const tool = await getTool(id);
        if (!tool) {
            return res.status(404).json({ error: 'Tool not found' });
        }
        return res.status(200).json(tool);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    const { query } = req;

    const validation = validateSchema(queryToolSchema, query);
    if (validation.code !== 0) {
        return res.status(400).json(validation.errors);
    }

    try {
        const tools = await getTools(query);
        return res.status(200).json(tools);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const validation = validateSchema(queryToolSchema, body);
    if (validation.code !== 0) {
        return res.status(400).json(validation.errors);
    }

    try {
        const tool = await updateTool(id, body);
        if (!tool) {
            return res.status(404).json({ error: 'Tool not found' });
        }
        return res.status(200).json(tool);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tool = await deleteTool(id);
        if (!tool) {
            return res.status(404).json({ error: 'Tool not found' });
        }
        return res.status(200).json({ message: 'Tool deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
