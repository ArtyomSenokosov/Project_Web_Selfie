import express from 'express';
import {body, check} from 'express-validator';
import {createUser, loginUser, renewToken, updateUser} from '../services/auth.js';
import {emailExists} from '../helpers/databaseValidators.js';
import {validateFields} from '../middlewares/validateFields.js';
import {validateJWT} from '../middlewares/validateJWT.js';

const router = express.Router();

router.post(
    "/register",
    [
        check("name", "Name is required").not().isEmpty(),
        check("name", "Name length must be max 32 characters").isLength({max: 32}),
        check("email", "Invalid email").isEmail(),
        check(
            "password",
            "Password should be 8-32 characters and include at least 1 number, 1 symbol, 1 lowercase and 1 uppercase letter."
        ).isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }),
        validateFields,
        emailExists,
    ],
    createUser
);

router.post('/login', [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').not().isEmpty().withMessage('Password is required'),
        validateFields
    ],
    loginUser
);

router.get('/renew', validateJWT, renewToken);

router.put('/update', [
        validateJWT,
        check('firstName', 'First name must be max 32 characters').isLength({max: 32}),
        check('lastName', 'Last name must be max 32 characters').isLength({max: 32}),
        check('birthDate', 'Invalid date').optional().isISO8601(),
        validateFields
    ],
    updateUser
);

export default router;
