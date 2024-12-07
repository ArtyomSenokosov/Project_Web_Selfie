import express from 'express';
import {body, param} from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import {validateJWT} from '../middlewares/validateJWT.js';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    completeTask,
    getTasksByStatus,
} from '../services/tasks.js';
import {taskExistsById, isTaskOwner} from '../helpers/databaseValidators.js';

const router = express.Router();

router.use(validateJWT);

router.get('/', getTasks);

router.get('/status', [
    body('status', 'Status is required and must be one of pending, completed, overdue')
        .isIn(['pending', 'completed', 'overdue']),
    validateFields,
], getTasksByStatus);

router.post('/', [
    body('title', 'Title is required').not().isEmpty(),
    body('title', 'Title must be maximum 100 characters long').isLength({max: 100}),
    body('dueDate', 'Invalid date').optional().isISO8601(),
    body('description', 'Description must be less than 500 characters').optional().isLength({max: 500}),
    validateFields,
], createTask);

router.put('/:id', [
    param('id', 'Invalid task ID').isMongoId(),
    body('title', 'Title is required').not().isEmpty(),
    body('title', 'Title must be maximum 100 characters long').isLength({max: 100}),
    body('dueDate', 'Invalid date').optional().isISO8601(),
    body('description', 'Description must be less than 500 characters').optional().isLength({max: 500}),
    validateFields,
    taskExistsById,
    isTaskOwner,
], updateTask);

router.patch('/:id/complete', [
    param('id', 'Invalid task ID').isMongoId(),
    validateFields,
    taskExistsById,
    isTaskOwner,
], completeTask);

router.delete('/:id', [
    param('id', 'Invalid task ID').isMongoId(),
    validateFields,
    taskExistsById,
    isTaskOwner,
], deleteTask);

export default router;
