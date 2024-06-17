import express from 'express';
import {body, param} from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import {validateJWTForNote} from '../middlewares/validateJWT.js';
import {createNote, getNotes, updateNote, deleteNote, getNotesByTitle} from '../services/notes.js';
import {noteExistsById, isNoteOwner} from '../helpers/databaseValidators.js';

const router = express.Router();

router.use(validateJWTForNote);

router.get('/', getNotes);

router.get('/title', [
    param('title', 'Title is required').not().isEmpty().trim().escape(),
    validateFields
], getNotesByTitle);

router.post('/', [
    body('title', 'Title is required').not().isEmpty().trim().escape(),
    body('title', 'Title must be maximum 100 characters long').isLength({max: 100}),
    body('text', 'Text is required').not().isEmpty(),
    body('text', 'Text must be less than 500 characters').isLength({max: 500}),
    validateFields
], createNote);

router.delete('/:id', [
    param('id', 'Invalid note ID').isMongoId(),
    validateFields,
    noteExistsById,
    isNoteOwner
], deleteNote);

router.put('/:id', [
    param('id', 'Invalid note ID').isMongoId(),
    body('title').notEmpty().withMessage('Title is required').isLength({max: 100}).withMessage('Title must be maximum 100 characters long'),
    body('text').notEmpty().withMessage('Text is required').isLength({max: 500}).withMessage('Text must be less than 500 characters'),
    validateFields,
    noteExistsById,
    isNoteOwner
], updateNote);

export default router;
