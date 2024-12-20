import Event from '../models/Event.js';
import User from '../models/User.js';
import Note from '../models/Note.js';
import Task from '../models/Task.js';

export const eventExistsById = async (req, res, next) => {
    const {id} = req.params;
    const event = await Event.findById(id);

    if (!event) {
        return res.status(404).json({
            ok: false,
            msg: "Event id does not exist",
        });
    }

    next();
};

export const isEventOwner = async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(500).json({
            ok: false,
            msg: "Can't validate role if token is not validated.",
        });
    }
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (event.user.toString() !== userId) {
        return res.status(401).json({
            ok: false,
            msg: "Insufficient privileges",
        });
    }

    next();
};

export const emailExists = async (req, res, next) => {
    const {email} = req.body;
    const userExists = await User.findOne({email});

    if (userExists) {
        return res.status(400).json({
            ok: false,
            msg: "Email already exists",
        });
    }

    next();
};

export const noteExistsById = async (req, res, next) => {
    const {id} = req.params;
    const note = await Note.findById(id);

    if (!note) {
        return res.status(404).json({
            ok: false,
            msg: "Note id does not exist",
        });
    }

    next();
};

export const isNoteOwner = async (req, res, next) => {
    const userId = req.user.id;
    const {id: noteId} = req.params;
    const note = await Note.findById(noteId);

    console.log("Checking note ownership, User ID:", userId, "Note Owner ID:", note.user);

    if (!note) {
        return res.status(404).json({
            ok: false,
            msg: "Note id does not exist",
        });
    }

    if (note.user.toString() !== userId) {
        return res.status(401).json({
            ok: false,
            msg: "Insufficient privileges",
        });
    }

    next();
};

export const taskExistsById = async (req, res, next) => {
    const {id} = req.params;
    const task = await Task.findById(id);

    if (!task) {
        return res.status(404).json({
            ok: false,
            msg: "Task id does not exist",
        });
    }

    next();
};

export const isTaskOwner = async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(500).json({
            ok: false,
            msg: "Can't validate role if token is not validated.",
        });
    }
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
        return res.status(404).json({
            ok: false,
            msg: "Task not found.",
        });
    }

    if (task.user.toString() !== userId) {
        return res.status(401).json({
            ok: false,
            msg: "Insufficient privileges",
        });
    }

    next();
};
