import { Router } from 'express';
import {
    addTool,
    getTools,
    deleteTool,
    getTool,
    updateTool,
    toolSchema,
} from '../controller/tool.js';
import { validateRequest } from '@picturas/schema-validation';
import { queryToolSchema } from '../models/queryTool.js';

const router = Router();
router.use(
    validateRequest({
        body: toolSchema,
        query: queryToolSchema,
    })
);

router.post('/', async (req, res) => {
    const { body } = req;

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
