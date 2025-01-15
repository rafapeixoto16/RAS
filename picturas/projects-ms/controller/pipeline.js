import mongoose from 'mongoose';
import Pipeline from '../models/pipelineModel.js';
import Limits from '../models/limitsModel.js';

export const isPipelineActive = async (projectId) => {
    const pipeline = await Pipeline.findOne({ projects: projectId }).exec();
    return pipeline !== null;
};

const getPipeline = async (userId) => {
    return await Pipeline.findOne({ _id: userId }).exec();
};

const updatePipeline = async (userId, pipeline) => {
    return await Pipeline.findOneAndUpdate(
        { _id: userId },
        { projects: pipeline.projects },
        { new: true, upsert: true }
    );
};

export const addProjectToPipeline = async (userId, projectId, userLimits) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    let pipeline = await Pipeline.findOne({ userId }).session(session);
    if (!pipeline) {
        pipeline = new Pipeline({ _id: userId, projects: [] });
    }

    if (pipeline.projects.length + 1 > userLimits.concurrentPipelines) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(`You can only have ${userLimits.concurrentPipelines} running at a time`);
    }

    const isProjectPresent = pipeline.projects.some(id => id.toString() === projectId.toString());
    if (isProjectPresent) {
        await session.abortTransaction();
        session.endSession();
        throw new Error('Project is already in the pipeline');
    }

    pipeline.projects.push(projectId);
    await pipeline.save({ session });

    await session.commitTransaction();
    session.endSession();

    return pipeline;
};

export const removeProjectFromPipeline = async (projectId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const pipeline = await Pipeline.findOne({ projects: projectId }).session(session);
    if (!pipeline) {
        await session.abortTransaction();
        session.endSession();
        throw new Error("The project is not being processed");
    }

    pipeline.projects = pipeline.projects.filter(id => id.toString() !== projectId.toString());
    await pipeline.save({ session });

    await session.commitTransaction();
    session.endSession();

    return pipeline;
};

const createPipeline = async (userId, projectId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const newPipeline = new Pipeline({
        _id: userId,
        projects: [projectId],
    });

    await newPipeline.save({ session });

    await session.commitTransaction();
    session.endSession();

    return newPipeline;
};

export const addProjectPipeline = async (userId, projectId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const updatedPipeline = await Pipeline.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { projects: projectId } },
        { new: true, upsert: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedPipeline;
};

export const removeProjectPipeline = async (userId, projectId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const updatedPipeline = await Pipeline.findOneAndUpdate(
        { _id: userId },
        { $pull: { projects: projectId } },
        { new: true, session }
    );

    if (!updatedPipeline) {
        await session.abortTransaction();
        session.endSession();
        throw new Error('Pipeline not found for the user');
    }

    await session.commitTransaction();
    session.endSession();

    return updatedPipeline;
};

export const isUserLimitReached = async (userId, limits) => {
    const userLimit = limits.dailyPipelines;

    let userLimits = await Limits.findOne({ _id: userId });

    if (!userLimits) {
        userLimits = new Limits({
            _id: userId,
            qtdRunnedPipelines: 1 
        });
        await userLimits.save();
        return false;
    }

    if (userLimits.qtdRunnedPipelines >= userLimit) {
        return true;
    }

    userLimits.qtdRunnedPipelines += 1;
    await userLimits.save();

    return false;
};
