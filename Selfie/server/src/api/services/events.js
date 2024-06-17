import Event from '../models/Event.js';
import strings from '../models/strings.js';

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("user", "name");
        return res.json({
            ok: true,
            events,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: strings.events.databaseError,
        });
    }
};

export const createEvent = async (req, res) => {
    const {title, start, end, notes, type, frequency, status, duration} = req.body;
    const event = new Event({
        title,
        start,
        end,
        notes,
        user: req.id,
        type,
        frequency: type === 'recurring' ? frequency : undefined,
        status,
        duration
    });

    try {
        await event.save();
        return res.status(201).json({
            ok: true,
            event,
            msg: strings.events.eventCreated,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: strings.events.databaseError,
        });
    }
};

export const updateEvent = async (req, res) => {
    const {id} = req.params;
    const {title, start, end, notes, type, frequency, status, duration} = req.body;

    try {
        const event = await Event.findByIdAndUpdate(
            id, {
                title,
                start,
                end,
                notes,
                type,
                frequency: type === 'recurring' ? frequency : undefined,
                status,
                duration
            }, {new: true}
        );

        if (!event) {
            return res.status(404).json({ok: false, msg: strings.events.eventNotFound});
        }

        return res.json({ok: true, event, msg: strings.events.eventUpdated});
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: strings.events.databaseError,
        });
    }
};

export const deleteEvent = async (req, res) => {
    const {id} = req.params;

    try {
        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ok: false, msg: strings.events.eventNotFound});
        }

        return res.json({
            ok: true,
            msg: strings.events.eventDeleted
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: strings.events.databaseError,
        });
    }
};
