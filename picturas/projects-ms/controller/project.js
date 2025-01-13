import * as Project from '../models/projectModel.js';
import { buildPagination, buildSort, buildQuery } from '../models/queryProject.js';
import {schemaValidation} from '@picturas/schema-validation';

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

// helper function
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
