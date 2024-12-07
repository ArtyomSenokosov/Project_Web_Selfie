import Note from '../models/Note.js';
import strings from '../models/strings.js';

export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({user: req.user.id});
        res.json({ok: true, notes});
    } catch (error) {
        res.status(500).json({ok: false, msg: strings.notes.fetchError});
    }
};

export const getNotesByTitle = async (req, res) => {
    try {
        const {title} = req.params;
        const notes = await Note.find({
            title: {$regex: title, $options: "i"},
            user: req.user.id,
        });
        res.json({ok: true, notes});
    } catch (error) {
        res.status(500).json({ok: false, msg: strings.notes.fetchError});
    }
};

export const createNote = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ok: false, msg: strings.notes.authRequired});
    }

    const {title, text, categories} = req.body;
    const note = new Note({
        title,
        text,
        categories,
        user: req.user.id,
    });

    try {
        await note.save();
        res.status(201).json({ok: true, note, msg: strings.notes.noteCreated});
    } catch (error) {
        res.status(500).json({ok: false, msg: strings.notes.createError, error: error.message});
    }
};

export const updateNote = async (req, res) => {
    const {id} = req.params;
    const {title, text, categories} = req.body;

    try {
        const note = await Note.findByIdAndUpdate(
            id,
            {title, text, categories},
            {new: true}
        );
        if (!note) {
            return res.status(404).json({ok: false, msg: strings.notes.noteNotFound});
        }
        res.json({ok: true, note, msg: strings.notes.noteUpdated});
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ok: false, msg: strings.notes.updateError, error: error.toString()});
    }
};

export const deleteNote = async (req, res) => {
    const {id} = req.params;

    try {
        const note = await Note.findByIdAndDelete(id);
        if (!note) {
            return res.status(404).json({ok: false, msg: strings.notes.noteNotFound});
        }
        res.json({ok: true, msg: strings.notes.noteDeleted});
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ok: false, msg: strings.notes.deleteError, error: error.toString()});
    }
};
