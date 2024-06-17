import React from 'react';
import PropTypes from 'prop-types';

const CalendarEvent = ({event}) => {
    const {title} = event;

    return (
        <div>
            <strong>{title}</strong>
        </div>
    );
};

CalendarEvent.propTypes = {
    event: PropTypes.object.isRequired,
};

export default CalendarEvent;
