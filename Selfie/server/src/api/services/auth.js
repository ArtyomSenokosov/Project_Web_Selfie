import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import {generateJWT} from '../helpers/jwt.js';
import strings from '../models/strings.js';

export const createUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});

        if (user) {
            return res.status(400).json({ok: false, msg: strings.auth.userExists});
        }

        user = new User(req.body);
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
        await user.save();
        const token = await generateJWT(user.id, user.name);

        return res.status(201).json({
            ok: true,
            user,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.auth.contactAdmin,
        });
    }
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: strings.auth.userNotFound,
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                ok: false,
                msg: strings.auth.invalidPassword,
            });
        }

        const token = await generateJWT(user.id, user.name);
        return res.status(200).json({
            ok: true,
            user,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.auth.contactAdmin,
        });
    }
};

export const renewToken = async (req, res) => {
    const {id, name} = req;
    try {
        const token = await generateJWT(id, name);
        return res.json({
            ok: true,
            user: {_id: id, name},
            token,
            msg: strings.auth.tokenRenewed,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.auth.contactAdmin,
        });
    }
};

export const updateUser = async (req, res) => {
    const {id} = req.user;
    const {firstName, lastName, birthDate} = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: strings.auth.userNotFound,
            });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.birthDate = birthDate || user.birthDate;

        await user.save();

        return res.json({
            ok: true,
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: strings.auth.contactAdmin,
        });
    }
};
