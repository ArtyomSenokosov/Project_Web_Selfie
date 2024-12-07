import React from 'react';
import PropTypes from 'prop-types';
import './calendar.css';

const CalendarEvent = ({event}) => {
    const {title, type, duration, location} = event;

    const getClassName = () => {
        let className = "calendar-event";
        if (type === "recurring") className += " recurring-event";
        if (type === "one-time") className += " one-time-event";
        if (duration === "long-term") className += " long-term-event";
        return className;
    };

    return (
        <div className={getClassName()}>
            <strong>{title}</strong>
            {location && (
                <p className="event-location">
                    <em>Location: {location}</em>
                </p>
            )}
        </div>
    );
};

CalendarEvent.propTypes = {
    event: PropTypes.shape({
        title: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["recurring", "one-time"]).isRequired,
        duration: PropTypes.oneOf(["short-term", "long-term"]),
        location: PropTypes.string,
    }).isRequired,
};

export default CalendarEvent;
