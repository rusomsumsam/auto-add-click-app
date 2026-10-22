const Project = require('../models/Project');

// POST /api/projects
async function createProject(req, res, next) {
    try {
        const { name, url, description } = req.body;

        // ইউজারের অধীনে এই নামে আগে থেকেই প্রজেক্ট আছে কিনা চেক
        const existingProject = await Project.findOne({ user: req.user._id, name });
        if (existingProject) {
            return res.status(409).json({
                status: 'error',
                message: 'A project with this name already exists',
            });
        }

        const project = await Project.create({
            user: req.user._id, // req.user আসে requireAuth middleware থেকে
            name,
            url,
            description: description || '',
        });

        res.status(201).json({
            status: 'ok',
            message: 'Project created successfully',
            project,
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/projects
async function getProjects(req, res, next) {
    try {
        // শুধুমাত্র লগইন করা ইউজারের প্রজেক্টগুলো দেখাবে
        const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.json({
            status: 'ok',
            count: projects.length,
            projects,
        });
    } catch (err) {
        next(err);
    }
}

// PATCH /api/projects/:id
async function updateProject(req, res, next) {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user._id });

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found or you do not have permission',
            });
        }

        const { name, url, description, status } = req.body;

        if (name !== undefined) project.name = name;
        if (url !== undefined) project.url = url;
        if (description !== undefined) project.description = description;
        if (status !== undefined) project.status = status;

        await project.save();

        res.json({
            status: 'ok',
            message: 'Project updated successfully',
            project,
        });
    } catch (err) {
        next(err);
    }
}

// DELETE /api/projects/:id
async function deleteProject(req, res, next) {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found or you do not have permission',
            });
        }

        res.json({
            status: 'ok',
            message: 'Project deleted successfully',
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { createProject, getProjects, updateProject, deleteProject };