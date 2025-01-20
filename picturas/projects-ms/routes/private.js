import { Router } from 'express';
import { deleteProjects, getProjects, uploadArtifact } from '../controller/project.js';
import minioClient from '../config/minioClient.js';
import { listObjectsPromise } from '../models/projectModel.js';
import { removeProjectPipeline } from '../controller/pipeline.js';
import multer from 'multer';

const router = Router();

router.delete('/deleteAccount', async (req, res) => {
    try {
        const userId = req.body.userId;

        await deleteProjects(userId);
        
        res.sendStatus(200);
    } catch(_) {
        res.sendStatus(500);
    }
});

router.post('/migrateAccount', async (req, res) => {
    try {
        const userId = req.body.userId;
        const projects = await Project.find({ userId });

        await Promise.all(project.map(async project => {
            const projectId = project._id.toString();

            const files = await listObjectsPromise(process.env.S3_TEMP_BUCKET, projectId, true);

            // move the files to the other bucket
            for (const file of files) {
                const targetObjectName = `${projectId}/${file.name}`;
                await minioClient.copyObject(process.env.S3_PICTURE_BUCKET, targetObjectName, `/${process.env.S3_TEMP_BUCKET}/${targetObjectName}`);
            }

            await minioClient.removeObjects(process.env.S3_TEMP_BUCKET, files);

            await Project.updateOne({ _id: projectId }, { ttl: null });
        }));

        res.status(200).json({ message: 'Account migration completed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to migrate account.', error: error.message });
    }
});

const storage = multer.memoryStorage();
const upload = multer({storage});

router.post('/terminated/:userId/:id', upload.single('process'), async (req, res) => {
    try {
        const { id, userId } = req.params;
        if (!req.file) return res.sendStatus(400);
        const process = req.file.buffer;

        const imageUrl = await uploadArtifact(userId, id, process, false);
        await removeProjectPipeline(userId, id);

        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({ message: 'Failed to terminate project.', error: error.message });
    }
});

export default router;
