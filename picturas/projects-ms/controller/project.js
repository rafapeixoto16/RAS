import * as Project from '../models/projectModel.js';
import { buildPagination, buildSort, buildQuery } from '../models/queryProject.js';
import {schemaValidation} from '@picturas/schema-validation';
import Image from '../models/imageModel.js'
import minioClient from '../config/minioClient.js';
import sharp from 'sharp';
import path from 'node:path';

export const projectSchema = schemaValidation.object({
    name: schemaValidation.string().min(1, 'Name is required'),
    user_id: schemaValidation.string().uuid('Invalid user ID'),
    tools: schemaValidation.array(
        schemaValidation.object({
            filterName: schemaValidation.string().min(1, 'Filter name is required'),
            args: schemaValidation.record(schemaValidation.any()),
        })
    ).optional(),
    images: schemaValidation.array(
        schemaValidation.object({
            id: objectIdSchema, 
            format: schemaValidation.enum(['png', 'jpg', 'jpeg', 'bmp', 'webp', 'tiff']),
        })
    ).optional(),
    result: schemaValidation.object({
        expireDate: schemaValidation.date().optional(),
        output: objectIdSchema.optional(),  // S3 filename 
    }).optional(),
    ttl: schemaValidation.date().nullable().optional(),
});

export const getProject = async (id) => {
    return Project.findOne({ _id: id }).exec();
};

export const getProjects = async (query) => {
    const { page, limit, sort } = query;
    const pagination = buildPagination({ page, limit });
    const sortObject = buildSort(sort);
    const queryObject = buildQuery(query);
    return Project.find(queryObject)
        .sort(sortObject)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec();
};

export const addProject = async (u) => {
    return new Project(u).save();
};

export const updateProject = (id, info) => {
    return Project.updateOne({ _id: id }, info).exec();
};

export const deleteProject = (id) => {
    return Project.deleteOne({ _id: id }).exec();
};

//////////////////////////////////////////////////////////////////////////////////////////
// Tools
//////////////////////////////////////////////////////////////////////////////////////////

export const addTool = async (projectId, tool) => {
    const project = await getProject(projectId);

    if (!project) {
        throw new Error('Project not found');
    }

    project.tools.push(tool);
    const addedToolIndex = project.tools.length - 1;
    const updatedProject = await updateProject(projectId, project);

    return {
        updatedProject,
        addedToolIndex
    };
};

export const removeTool = async (projectId, toolIdx) => {
    const project = await getProject(projectId);

    if (!project) {
        throw new Error('Project not found');
    }

    if (toolIdx < 0 || toolIdx >= project.tools.length) {
        throw new Error('Invalid tool index');
    }

    const removedTool = project.tools.splice(toolIdx, 1)[0];
    const updatedProject = await updateProject(projectId, project);

    return {
        updatedProject,
        removedTool
    };
}

export const reorderTool = async (projectId, toolIdx, toolIdxAfter) => {
    const project = await getProject(projectId);

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

    const updatedProject = await updateProject(projectId, project);

    return {
        updatedProject,
        movedTool,
        toolIdx
    };
}

//////////////////////////////////////////////////////////////////////////////////////////
// Images
//////////////////////////////////////////////////////////////////////////////////////////

// file = req.file from multer
export const addImage = async (projectId, file, userLimits) => {
    const extensionName = path.extname(req.file.originalname);
    const imageName = `${(new Date()).now()}${extensionName}`;
    const is4kAllowed = userLimits.has4kUpload;

    // check if the project exists
    const checkProject = await getProject(projectId);
    if (!checkProject) {
        throw new Error('Project not found')
    }

    if(!is4kAllowed && await isImage4k(file.buffer)) {
        throw new Error("The user is not premium therefore 4k images are not allowed");
    }

    const metaData = {
        'Content-Type': file.mimetype,
    };

    let imageUrl;

    minioClient.putObject(
        // TODO: change this
        ///process.env.S3_PICTURE_BUCKET
        process.env,
        imageName,
        file.buffer,
        metaData,
        (err, etag) => {
            if (err) throw new Error('Failed to upload image to MinIO');
            imageUrl = `${process.env.S3_PICTURE_BUCKET}/${imageName}`;
        }
    );

    const { project, idx } = await addImageToProject(projectId, {
        id: imageUrl,
        format: extensionName
    });

    return { updatedProject, imageIdx: idx };
}

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

const addImageToProject = async (projectId, image) => {
    const project = await getProject(projectId);
    if (!project) {
        throw new Error('Project not found');
    }
    const idx = project.images.push(image);
    const updatedProject = await updateProject(projectId, project);
    return {
        updatedProject,
        idx
    };
};

export const removeImage = async (projectId, imageIdx) => {
    const project = await getProject(projectId);
    if (!project) {
        throw new Error('Project not found');
    }
    if (imageIdx < 0 || imageIdx >= project.images.length) {
        throw new Error('Invalid image index');
    }

    const removedImage = project.images.splice(imageIdx, 1)[0];
    const updatedProject = await updateProject(projectId, project);
    const imageName = removedImage.id; // S3 location

    minioClient.removeObject(
        // TODO: change this
        process.env.S3_PICTURE_BUCKET,
        imageName,
    );

    return {
        updatedProject,
        removedImage
    };
};

///////////////////////////////////////////////////////////////////////////
// S3 Specific
///////////////////////////////////////////////////////////////////////////

export const downloadImageLocally = async (imageName, targetPath) => {
    const localFilePath = path.resolve(targetPath, imageName);

    const objectStream = await minioClient.getObject(
        process.env.S3_PICTURE_BUCKET,
        imageName
    );

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(localFilePath);

        objectStream.pipe(fileStream);

        objectStream.on('error', (err) => {
            console.error('Error downloading the image:', err);
            reject(new Error('Failed to download the image from MinIO'));
        });

        fileStream.on('finish', () => {
            console.log(`Image downloaded successfully to ${localFilePath}`);
            resolve(localFilePath);
        });

        fileStream.on('error', (err) => {
            console.error('Error saving the image locally:', err);
            reject(new Error('Failed to save the image locally'));
        });
    });
};

export const uploadLocalImage = async (filePath, isPreview, projectId) => {
    if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist');
    }

    const fileStream = fs.createReadStream(filePath);
    const extensionName = pathModule.extname(filePath);
    const contentType = mime.lookup(extensionName);
    const objectId = new mongoose.Types.ObjectId();

    const fileName = `${objectId}${extensionName}`;
    
    const bucketName = isPreview 
        ? process.env.S3_PREVIEW_BUCKET 
        : process.env.S3_PICTURE_BUCKET;

    const metaData = {
        'Content-Type': contentType,
    };

    await minioClient.putObject(bucketName, fileName, fileStream, metaData);
    const imageUrl = await minioClient.presignedGetObject(bucketName, fileName, 24 * 60 * 60);

    // save the result in the project
    if(!isPreview){
        const project = await getProject(projectId);
        project.result = {
            output: imageUrl,
            // expireDate:  TODO: add expireDate when needed
        };
        await updateProject(projectId, project);
    }
    
    return imageUrl;
};
