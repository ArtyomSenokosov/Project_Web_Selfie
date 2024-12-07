import Task from "../models/Task.js";
import strings from "../models/strings.js";

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({user: req.user.id}).sort({dueDate: 1});
        return res.json({
            ok: true,
            tasks,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.tasks.databaseError || "Database error",
        });
    }
};

export const getTasksByStatus = async (req, res) => {
    const {status} = req.query;

    try {
        const query = {user: req.user.id};

        if (status === "overdue") {
            query.dueDate = {$lt: new Date()};
            query.isCompleted = false;
        } else if (status === "pending") {
            query.dueDate = {$gte: new Date()};
            query.isCompleted = false;
        } else if (status === "completed") {
            query.isCompleted = true;
        }

        const tasks = await Task.find(query).sort({dueDate: 1});
        return res.json({
            ok: true,
            tasks,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.tasks.databaseError || "Database error",
        });
    }
};

export const createTask = async (req, res) => {
    const {title, description, dueDate, priority} = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            user: req.user.id,
        });

        await newTask.save();

        return res.status(201).json({
            ok: true,
            task: newTask,
            msg: strings.tasks.taskCreated || "Task created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.tasks.databaseError || "Database error",
        });
    }
};

export const updateTask = async (req, res) => {
    const {id} = req.params;
    const {title, description, dueDate, isCompleted, priority} = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            id,
            {title, description, dueDate, isCompleted, priority},
            {new: true}
        );

        if (!task) {
            return res.status(404).json({
                ok: false,
                msg: strings.tasks.taskNotFound || "Task not found",
            });
        }

        return res.json({
            ok: true,
            task,
            msg: strings.tasks.taskUpdated || "Task updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.tasks.databaseError || "Database error",
        });
    }
};

export const completeTask = async (req, res) => {
    const {id} = req.params;

    try {
        const task = await Task.findByIdAndUpdate(
            id,
            {isCompleted: true},
            {new: true}
        );

        if (!task) {
            return res.status(404).json({
                ok: false,
                msg: strings.tasks.taskNotFound || "Task not found",
            });
        }

        return res.json({
            ok: true,
            task,
            msg: strings.tasks.taskCompleted || "Task marked as completed",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.tasks.databaseError || "Database error",
        });
    }
};

export const deleteTask = async (req, res) => {
    const {id} = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({
                ok: false,
                msg: strings.tasks.taskNotFound || "Task not found",
            });
        }

        return res.json({
            ok: true,
            msg: strings.tasks.taskDeleted || "Task deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.tasks.databaseError || "Database error",
        });
    }
};
