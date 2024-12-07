import express from 'express';
import {body, check} from 'express-validator';
import {getEvents, createEvent, updateEvent, deleteEvent} from '../services/events.js';
import {eventExistsById, isEventOwner} from '../helpers/databaseValidators.js';
import {isDate, isDateAfter} from '../helpers/dateValidators.js';
import {validateFields} from '../middlewares/validateFields.js';
import {validateJWT} from '../middlewares/validateJWT.js';

const router = express.Router();

router.use(validateJWT);

router.get("/", getEvents);

router.post(
    "/",
    [
        body("title", "Title is required").not().isEmpty(),
        body("title", "Title must be maximum 32 characters long").isLength({max: 32}),
        body("start", "Start date is required").custom(isDate),
        body("end", "End date is required").custom(isDate),
        body("end", "End date must be after start date").custom((end, {req}) => isDateAfter(end, req.body.start)),
        body("notes", "Notes must be maximum 128 characters long").optional().isLength({max: 128}),
        body("location", "Location is required").not().isEmpty(),
        body("location", "Location must be maximum 128 characters long").isLength({max: 128}),
        validateFields
    ],
    createEvent
);

router.put(
    "/:id",
    [
        check("id", "Invalid event ID").isMongoId(),
        body("title", "Title is required").not().isEmpty(),
        body("title", "Title must be maximum 32 characters long").isLength({max: 32}),
        body("start", "Start date is required").custom(isDate),
        body("end", "End date is required").custom(isDate),
        body("notes", "Notes must be maximum 128 characters long").optional().isLength({max: 128}),
        body("location", "Location is required").not().isEmpty(),
        body("location", "Location must be maximum 128 characters long").isLength({max: 128}),
        validateFields,
        eventExistsById,
        isEventOwner
    ],
    updateEvent
);

router.delete(
    "/:id",
    [
        check("id", "Invalid event ID").isMongoId(),
        validateFields,
        eventExistsById,
        isEventOwner
    ],
    deleteEvent
);

export default router;
