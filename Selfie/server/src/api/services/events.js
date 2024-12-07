import Event from '../models/Event.js';
import strings from '../models/strings.js';

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("user", "name");
        const today = new Date();
        const currentWeekDay = today.getDay();
        const currentDate = today.getDate();

        const updatedEvents = events.map((event) => {
            if (event.type === 'recurring') {
                if (event.frequency === 'weekly' && !event.status.includes('completed')) {
                    const eventDay = new Date(event.start).getDay();
                    if (currentWeekDay === eventDay) {
                        return event;
                    }
                }
                if (event.frequency === 'monthly' && !event.status.includes('completed')) {
                    const eventMonthDay = new Date(event.start).getDate();
                    if (currentDate === eventMonthDay) {
                        return event;
                    }
                }
            }
            return event;
        });

        return res.json({
            ok: true,
            events: updatedEvents.filter(Boolean),
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
    const {title, start, end, notes, type, frequency, status, duration, location} = req.body;
    const event = new Event({
        title,
        start,
        end,
        notes,
        user: req.user.id,
        type,
        frequency: type === 'recurring' ? frequency : undefined,
        status,
        duration,
        location,
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
    const {title, start, end, notes, type, frequency, status, duration, location} = req.body;

    try {
        const event = await Event.findByIdAndUpdate(
            id,
            {
                title,
                start,
                end,
                notes,
                type,
                frequency: type === 'recurring' ? frequency : undefined,
                status,
                duration,
                location,
            },
            {new: true}
        );

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: strings.events.eventNotFound,
            });
        }

        return res.json({
            ok: true,
            event,
            msg: strings.events.eventUpdated,
        });
    } catch (error) {
        console.error(error);
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
            msg: strings.events.eventDeleted,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: strings.events.databaseError,
        });
    }
};
