import {useEffect, useState} from "react";
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import {removeError, setError, uiCloseModal} from "../../actions/ui";
import {useDispatch, useSelector} from "react-redux";
import {
    eventClearActive,
    eventStartAddNew,
    eventStartUpdate,
} from "../../actions/event";
import Alert from "../ui/Alert";
import './calendar.css';

Modal.setAppElement("#root");

const nowInitial = moment().minutes(0).seconds(0).add(1, "hour");
const nowEnd = nowInitial.clone().add(1, "hour");

const initEvent = {
    title: "",
    notes: "",
    location: "",
    start: nowInitial.toDate(),
    end: nowEnd.toDate(),
    type: "one-time",
    frequency: "daily",
    status: "pending",
    duration: "short-term",
};

const CalendarModal = () => {
    const dispatch = useDispatch();

    const {ui, calendar} = useSelector((state) => state);
    const {modalOpen, msgError} = ui;
    const {activeEvent} = calendar;

    const [formValues, setFormValues] = useState(initEvent);
    const {notes, title, location, start, end, type, frequency, status, duration} = formValues;

    useEffect(() => {
        if (activeEvent) {
            setFormValues({
                ...activeEvent,
                type: activeEvent.type || "one-time",
                frequency: activeEvent.frequency || "daily",
                status: activeEvent.status || "pending",
                duration: activeEvent.duration || "short-term",
                location: activeEvent.location || "",
            });
        } else {
            setFormValues(initEvent);
        }
    }, [activeEvent]);

    const handleInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value,
        });
    };

    const closeModal = () => {
        if (modalOpen) {
            dispatch(eventClearActive());
            dispatch(uiCloseModal());
        }
    };

    const handleStartDateChange = (e) => {
        setFormValues({
            ...formValues,
            start: e,
        });
    };

    const handleEndDateChange = (e) => {
        setFormValues({
            ...formValues,
            end: e,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isFormValid()) return;

        if (activeEvent && activeEvent.id) {
            dispatch(eventStartUpdate(formValues));
        } else {
            dispatch(eventStartAddNew(formValues));
        }

        closeModal();
    };

    const isFormValid = () => {
        if (title.trim().length === 0) {
            dispatch(setError("Title is required"));
            return false;
        } else if (title.trim().length > 32) {
            dispatch(setError("Title length must be max 32 characters"));
            return false;
        } else if (moment(start).isSameOrAfter(moment(end))) {
            dispatch(setError("End date must be after start date"));
            return false;
        } else if (notes && notes.trim().length > 128) {
            dispatch(setError("Notes length must be max 128 characters"));
            return false;
        } else if (location.trim().length === 0) {
            dispatch(setError("Location is required"));
            return false;
        } else if (location.trim().length > 128) {
            dispatch(setError("Location length must be max 128 characters"));
            return false;
        } else if (type === 'recurring' && !frequency) {
            dispatch(setError("Frequency is required for recurring events"));
            return false;
        } else if (!status) {
            dispatch(setError("Status is required"));
            return false;
        } else if (!duration) {
            dispatch(setError("Duration is required"));
            return false;
        }
        dispatch(removeError());
        return true;
    };

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            closeTimeoutMS={200}
            contentLabel="Event modal"
            className="modal"
            overlayClassName="modal__background"
        >
            <h1 className="modal__title">
                {activeEvent ? "Edit event" : "New event"}
            </h1>
            <hr/>
            <form className="form" onSubmit={handleSubmit}>
                {msgError && <Alert type="error" description={msgError}/>}
                <div className="form__field">
                    <label className="form__label">Start date</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={start}
                        className="form__input"
                    />
                </div>
                <div className="form__field">
                    <label className="form__label">End date</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={end}
                        minDate={start}
                        className="form__input"
                    />
                </div>
                <hr/>
                <div className="form__field">
                    <label htmlFor="title" className="form__label">
                        Event title
                    </label>
                    <input
                        autoComplete="off"
                        type="text"
                        className="form__input"
                        id="title"
                        name="title"
                        placeholder="New event"
                        value={title}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form__field">
                    <label htmlFor="location" className="form__label">
                        Location
                    </label>
                    <input
                        autoComplete="off"
                        type="text"
                        className="form__input"
                        id="location"
                        name="location"
                        placeholder="Enter location"
                        value={location}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form__field">
                    <label htmlFor="notes" className="form__label">
                        Notes
                    </label>
                    <textarea
                        type="text"
                        className="form__text-area"
                        rows="5"
                        id="notes"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className="form__field">
                    <label htmlFor="type" className="form__label">
                        Event Type
                    </label>
                    <select
                        id="type"
                        name="type"
                        className="form__select"
                        value={type}
                        onChange={handleInputChange}
                    >
                        <option value="one-time">One-time</option>
                        <option value="recurring">Recurring</option>
                    </select>
                </div>
                {type === 'recurring' && (
                    <div className="form__field">
                        <label htmlFor="frequency" className="form__label">
                            Frequency
                        </label>
                        <select
                            id="frequency"
                            name="frequency"
                            className="form__select"
                            value={frequency}
                            onChange={handleInputChange}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                )}
                <div className="form__field">
                    <label htmlFor="status" className="form__label">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        className="form__select"
                        value={status}
                        onChange={handleInputChange}
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className="form__field">
                    <label htmlFor="duration" className="form__label">
                        Duration
                    </label>
                    <select
                        id="duration"
                        name="duration"
                        className="form__select"
                        value={duration}
                        onChange={handleInputChange}
                    >
                        <option value="short-term">Short-term</option>
                        <option value="long-term">Long-term</option>
                    </select>
                </div>
                <button className="btn btn-primary btn--block" type="submit">
                    Save
                </button>
            </form>
        </Modal>
    );
};

export default CalendarModal;
