import { Router } from 'express';
import {
    updateProject,
    addProject,
    getProjects,
    deleteProject,
    getProject,
    addTool,
    removeTool,
    reorderTool,
    addImage,
    getImage,
    removeImage,
    downloadImageLocally,
    uploadLocalImage,
    objectIdSchema,
    filterProject,
    reorderImage
} from '../controller/project.js';
import { queryProjectSchema } from '../models/queryProject.js';
import { schemaValidation, validateRequest } from '@picturas/schema-validation';
import schemas from '../utils/filters.js';
import multer from '../config/multerConfig.js';
import { getLimitsMiddleware } from '../utils/premium.js'
import {
    addProjectToPipeline,
    removeProjectFromPipeline,
    isUserLimitReached
} from '../controller/pipeline.js'
import {
    cancelPipeline,
    runPipeline,
    runPreview,
    setHooks
} from '../utils/filterCall.js'

setHooks(
    async (imageInfo, path) => {
        await downloadImageLocally(imageInfo, path);
    }, 
    async  (projectId, path, isPreview) => {
        return await uploadLocalImage(path, isPreview, projectId) // returns public S3 url
    }, 
    async (projectId) => {
        const updatedPipeline = await removeProjectFromPipeline(projectId);
    }
)

const router = Router();
router.use(getLimitsMiddleware);

router.post('/', validateRequest({
    body: schemaValidation.object({
        name: schemaValidation.string()
    })
}), async (req, res) => {
    // TODO we can easily limit the number of project
    try {
        const data = {
            ...req.body,
            userId: req.user._id
        }

        if (req.user.limits.hasTtl) {
            data.ttl = ttlStartTime;
        }

        const project = await addProject(data);
        return res.status(200).json(filterProject(project));
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to add project' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const project = await getProject(req.user._id, id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(filterProject(project));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/:id/output', async (req, res) => {
    const { id } = req.params;

    try {
        const project = await getProject(req.user._id, id);
        if (!project || !project.result.output) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json({output: project.result.output});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/', validateRequest({
    query: queryProjectSchema
}, { strict: false }), async (req, res) => {
    const { query } = req;

    try {
        const projects = await getProjects(req.user._id, query);
        if (!projects) {
            return res.status(404).json({ error: 'Projects not found' });
        }
        return res.status(200).json(projects.map(p => filterProject(p)));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/:id', validateRequest({
    body: schemaValidation.object({
        name: schemaValidation.string()
    }),
}), async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    try {
        const project = await updateProject(req.user._id, id, body);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(filterProject(project));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const project = await deleteProject(req.user._id, id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(filterProject(project));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
// Tools
//////////////////////////////////////////////////////////////////////////////////////////

router.post('/:id/tool', validateRequest({
    body: schemaValidation.object({
        filterName: schemaValidation.enum(Object.keys(schemas)),
        args: schemaValidation.unknown(),
    })
    .strict()
    .refine((data) => {
        console.error(schemas[data.filterName])
        return schemas[data.filterName].schema.safeParse(data.args).success
    })
}, {strict: false}), async (req, res) => {
    const { id } = req.params;
    const toolInformation = req.body;

    // if the user is not premium and it tries to add a premium tool just send a 401 
    // (Not sure if this is the best way to do it)
    const isToolPremium = schemas[toolInformation.filterName].isPremium;

    if (isToolPremium && !req.user.isPremium) {
        return res.status(401).json({ error: 'You need to be premium to use this tool' });
    }

    try {
        const index = await addTool(req.user._id, id, toolInformation);
        return res.status(200).json({index})
    } catch(error) {
        return res.status(500).json({ error: error.message });
    } 
})

router.delete('/:id/tool/:idxTool', async (req, res) => {
    const { id, idxTool } = req.params;

    try {
        const { project, removedTool } = await removeTool(req.user._id, id, idxTool);
        return res.status(200).json({
            project,
            removedTool
        });
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
})

router.put('/:id/tool/:idxTool', validateRequest({
  body: schemaValidation.object({
    idxToolAfter: schemaValidation.number().min(0)
  })
}), async (req, res) => {
    const { id, idxTool } = req.params;
    const { idxToolAfter } = req.body;
    
    try {
        const { reorderedTool, toolIdx } = await reorderTool(req.user._id, id, idxTool, idxToolAfter);
        return res.status(200).json({
            reorderedTool,
            toolIdx
        });
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
})

//////////////////////////////////////////////////////////////////////////////////////////
// Images
//////////////////////////////////////////////////////////////////////////////////////////

router.get('/:id/image/:idxImage', async (req, res) => {
    const { id, idxImage } = req.params;

    try {
        const imageUrl = await getImage(req.user._id, id, idxImage);
        return res.status(200).json({
            imageUrl
        });
    } catch(error) {
        return res.status(500).json({ error: error.message });
    } 
})

router.post('/:id/image', multer.single('projectImage'), async (req, res) => {
    const { id } = req.params;
    const image = req.file;
    const userLimits = req.user.limits;

    // TODO we can easily limit the number of images in project

    if (!image) {
        return res.status(400).json({error: 'No image uploaded'});
    }

    try {
        const { index, imageUrl } = await addImage(req.user._id, id, image, userLimits);
        return res.status(200).json({
            index,
            imageUrl
        })
    } catch(error) {
        return res.status(500).json({ error: error.message });
    } 
})

router.put('/:id/image/:idxImage', validateRequest({
    body: schemaValidation.object({
      idxImageAfter: schemaValidation.number().min(0)
    })
  }), async (req, res) => {
      const { id, idxImage } = req.params;
      const { idxImageAfter } = req.body;
      
      try {
          const { reorderedImage, imageIdx } = await reorderImage(req.user._id, id, idxImage, idxImageAfter);
          return res.status(200).json({
              reorderedImage,
              imageIdx
          });
      } catch(error) {
          return res.status(500).json({ error: error.message });
      }
  })

router.delete('/:id/image/:idxImage', async (req, res) => {
    const { id, idxImage } = req.params;

    try {
        const removedImage = await removeImage(req.user._id, id, idxImage);
        return res.status(200).json({removedImage});
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
})

////////////////////////////////////////////////////////////////////////////
// Process a project
///////////////////////////////////////////////////////////////////////////

router.post('/:id/process', async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const userLimits = req.user.limits;
    
    try {
        const isLimitReached = await isUserLimitReached(userId, userLimits);
        if (isLimitReached) 
            return res.status(429).json({
                message: 'Daily limit reached'
            })

        const updatedPipeline = await addProjectToPipeline(userId, id, userLimits);
        const project = await getProject(id);

        await runPipeline(userId, id, project.images, project.tools, !req.user.limits.noWatermark)

        res.status(200).json({
            message: 'Pipeline processing started.',
            pipeline: updatedPipeline
        });
    } catch (error) {
        res.status(500).json({ message: `Error processing pipeline: ${error.message}` });
    }
});

router.post('/:id/preview', validateRequest({
    body: schemaValidation.object({
        imageId: objectIdSchema
    })
}), async (req, res) => {
    const { id } = req.params;
    const {imageId} = req.body;
    const userId = req.user._id;
    const userLimits = req.user.limits;
    
    try {
        const updatedPipeline = await addProjectToPipeline(userId, id, userLimits);
        const project = await getProject(id);

        const image = await project.images.findOne(id => id === imageId);
        if (!image) {
            res.status(404).json({ message: `The specified image does not exist` });
        }

        await runPipeline(userId, id, [image], project.tools, !req.user.limits.noWatermark)

        res.status(200).json({
            message: 'Pipeline processing started.',
            pipeline: updatedPipeline
        });
    } catch (error) {
        res.status(500).json({ message: `Error processing pipeline: ${error.message}` });
    }
});

router.delete('/:id/process', async (req, res) => {
    const { id } = req.params;

    try {
        await cancelPipeline(id);

        res.status(200).json({
            message: 'Pipeline processing canceled.',
            pipeline: updatedPipeline
        });
    } catch (error) {
        res.status(500).json({ message: `Error processing pipeline: ${error.message}` });
    }
    
});

export default router;
