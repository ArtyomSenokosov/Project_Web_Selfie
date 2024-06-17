import moment from 'moment';

export const isDate = (value) => {
    if (!value) {
        return false;
    }

    const date = moment(value, true);
    return date.isValid();
};

export const isDateAfter = (end, start) => {
    return !moment(start).isSameOrAfter(moment(end));
};
