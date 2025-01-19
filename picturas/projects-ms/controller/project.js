import Project from '../models/projectModel.js';
import { buildPagination, buildQuery, buildSort } from '../models/queryProject.js';
import { schemaValidation } from '@picturas/schema-validation';
import Image from '../models/imageModel.js';
import minioClient, { rewriteS3Url } from '../config/minioClient.js';
import sharp from 'sharp';
import path from 'node:path';
import mongoose from 'mongoose';
import fs from 'node:fs';

export const objectIdSchema = schemaValidation.string().refine((val) => mongoose.Types.ObjectId.isValid(val));

export const getProject = async (userId, id) => {
    return Project.findOne({ userId, _id: id }).exec();
};

export const getProjects = async (userId, query) => {
    const { page, limit, sort, order } = query;
    const pagination = buildPagination({ page, limit });
    const sortObject = buildSort(sort, order);
    const queryObject = buildQuery(query);
    return Project.find({...queryObject, userId})
        .sort(sortObject)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec();
};

export const addProject = async (u) => {
    return new Project(u).save();
};

export const updateProject = (userId, id, info) => {
    return Project.updateOne({ userId, _id: id }, info).exec();
};

export const deleteProject = (userId, id) => {
    return Project.deleteOne({ userId, _id: id }).exec();
};

export const getImage = async (projectId, imageRef) => {
    let image = await Image.findById(imageRef.id);

    if (!image) {
        const extensionName = imageRef.format.startsWith('.') ? imageRef.format : `.${imageRef.format}`;
        const bucketName = process.env.S3_PICTURE_BUCKET;
        const imageName = `${projectId}/${imageRef.id}${extensionName}`;
        const publicUrl = await minioClient.presignedGetObject(bucketName, imageName, 24 * 60 * 60);

        image = new Image({
            _id: imageRef.id,
            url: publicUrl,
        });

        await image.save();

        return rewriteS3Url(publicUrl);
    }

    return rewriteS3Url(image.url);
};

export const filterProject = async (project) => ({
    name: project.name,
    _id: project._id,
    tools: project.tools,
    images: await Promise.all(project.images.map(async (image) => await getImage(project._id, image))),
    result: (project.result && project.result.expireDate > Date.now()) ? project.result.output : null,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
});

//////////////////////////////////////////////////////////////////////////////////////////
// Tools
//////////////////////////////////////////////////////////////////////////////////////////

export const addTool = async (userId, projectId, tool) => {
    const project = await getProject(userId, projectId);

    if (!project) {
        throw new Error('Project not found');
    }

    project.tools.push(tool);
    const addedToolIndex = project.tools.length - 1;
    const updatedProject = await updateProject(userId, projectId, project);

    return addedToolIndex;
};

export const removeTool = async (userId, projectId, toolIdx) => {
    const project = await getProject(userId, projectId);

    if (!project) {
        throw new Error('Project not found');
    }

    if (toolIdx < 0 || toolIdx >= project.tools.length) {
        throw new Error('Invalid tool index');
    }

    const removedTool = project.tools.splice(toolIdx, 1)[0];
    const updatedProject = await updateProject(userId, projectId, project);

    return {
        updatedProject,
        removedTool
    };
}

export const reorderTool = async (userId, projectId, toolIdx, toolIdxAfter) => {
    const project = await getProject(userId, projectId);

    if (!project) {
        throw new Error('Project not found');
    }

    const toolsLength = project.tools.length;
    if (toolIdx < 0 || toolIdx >= toolsLength) {
        throw new Error('Invalid current tool index');
    }

    if (toolIdxAfter < 0 || toolIdxAfter >= toolsLength) {
        throw new Error('Invalid target tool index');
    }

    const [movedTool] = project.tools.splice(toolIdx, 1);
    project.tools.splice(toolIdxAfter, 0, movedTool);

    await updateProject(userId, projectId, project);

    return {
        movedTool,
        toolIdx
    };
}

//////////////////////////////////////////////////////////////////////////////////////////
// Images
//////////////////////////////////////////////////////////////////////////////////////////

// file = req.file from multer
export const addImage = async (userId, projectId, file, userLimits) => {
    const extensionName = path.extname(file.originalname);
    const objectId = new mongoose.Types.ObjectId();
    const imageName = `${projectId}/${objectId}${extensionName}`;
    const is4kAllowed = userLimits.has4kUpload;

    const project = await getProject(userId, projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    if (!is4kAllowed && await isImage4k(file.buffer)) {
        throw new Error("The user is not premium; 4K images are not allowed.");
    }

    const bucketName = process.env.S3_PICTURE_BUCKET;

    const metaData = {
        'Content-Type': file.mimetype,
    };

    await minioClient.putObject(bucketName, imageName, file.buffer, metaData);

    const publicUrl = await minioClient.presignedGetObject(bucketName, imageName, 24 * 60 * 60);

    const imageDocument = new Image({
        _id: objectId,
        url: publicUrl,
    });

    await imageDocument.save();

    const { updatedProject, idx } = await addImageToProject(userId, projectId, {
        id: objectId,
        format: extensionName.replace('.', ''),
    });

    return { imageIdx: idx, imageUrl: rewriteS3Url(publicUrl) };
};

const isImage4k = async (image) => {
    const metadata = await sharp(image).metadata();

    const width = metadata.width;
    const height = metadata.height;

    if (!width || !height) {
        throw new Error('Invalid image dimensions');
    }

    // Check if the image meets or exceeds 4K resolution
    return (width >= 3840 && height >= 2160) || (width >= 2160 && height >= 3840);
}

const addImageToProject = async (userId, projectId, image) => {
    const project = await getProject(userId, projectId);
    if (!project) {
        throw new Error('Project not found');
    }
    const idx = project.images.push(image);
    const updatedProject = await updateProject(userId, projectId, {images: project.images});
    return {
        updatedProject,
        idx
    };
};

export const removeImage = async (userId, projectId, imageIdx) => {
    const project = await getProject(userId, projectId);
    if (!project) {
        throw new Error('Project not found');
    }
    if (imageIdx < 0 || imageIdx >= project.images.length) {
        throw new Error('Invalid image index');
    }

    const removedImage = project.images.splice(imageIdx, 1)[0];
    const updatedProject = await updateProject(userId, projectId, {images: project.images});
    const imageName = `${projectId}/${removedImage.id}.${removedImage.format}`; // S3 location

    await minioClient.removeObject(
        process.env.S3_PICTURE_BUCKET,
        imageName,
    );

    return removedImage;
};

export const reorderImage = async (userId, projectId, imageIdx, imageIdxAfter) => {
    const project = await getProject(userId, projectId);

    if (!project) {
        throw new Error('Project not found');
    }

    const imageLength = project.images.length;
    if (imageIdx < 0 || imageIdx >= imageLength) {
        throw new Error('Invalid current image index');
    }

    if (imageIdxAfter < 0 || imageIdxAfter >= imageLength) {
        throw new Error('Invalid target image index');
    }

    const [movedImage] = project.images.splice(imageIdx, 1);
    project.images.splice(imageIdxAfter, 0, movedImage);

    await updateProject(userId, projectId, project);

    return {
        movedImage,
        imageIdx
    };
}

///////////////////////////////////////////////////////////////////////////
// S3 Specific
///////////////////////////////////////////////////////////////////////////

export const downloadImageLocally = async (projectId, imageName, targetPath) => {
    const localFilePath = path.resolve(targetPath);

    const objectStream = await minioClient.getObject(
        process.env.S3_PICTURE_BUCKET,
        `${projectId}/${imageName.id}.${imageName.format}`
    );

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(localFilePath);

        objectStream.pipe(fileStream);

        objectStream.on('error', (_) => {
            reject(new Error('Failed to download the image from MinIO'));
        });

        fileStream.on('finish', () => {
            resolve(localFilePath);
        });

        fileStream.on('error', (_) => {
            reject(new Error('Failed to save the image locally'));
        });
    });
};

export const uploadArtifact = async (userId, projectId, buffer, isPreview) => {
    const objectId = new mongoose.Types.ObjectId();
    const fileName = `${objectId}.zip`;
    const bucketName = process.env.S3_TEMP_BUCKET

    await minioClient.putObject(bucketName, fileName, buffer);
    const imageUrl = rewriteS3Url(await minioClient.presignedGetObject(bucketName, fileName, 24 * 60 * 60));

    // save the result in the project
    if(!isPreview){
        const result = {
            output: imageUrl,
            expireDate:  Date.now()
        };
        await updateProject(userId, projectId, {result});
    }
    
    return imageUrl;
};
