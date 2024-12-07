import Swal from "sweetalert2";
import {fetchWithToken} from "../helpers/fetch";
import {prepareEvents} from "../helpers/prepareEvents";
import types from "../types";

export const eventStartLoading = () => {
    return async (dispatch, getState) => {
        const {id: currentUserId} = getState().auth; // ID текущего пользователя
        try {
            const resp = await fetchWithToken("events");
            const data = await resp.json();

            if (data.ok) {
                const events = prepareEvents(data.events);
                dispatch(setCurrentUserId(currentUserId)); // Устанавливаем ID пользователя
                dispatch(eventLoaded(events));
            } else {
                Swal.fire("Error", data.msg || "Error loading events.", "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Please, contact the administrator", "error");
        }
    };
};

// Экшен для установки текущего пользователя
const setCurrentUserId = (userId) => ({
    type: types.setCurrentUserId,
    payload: userId,
});

export const eventStartAddNew = (event) => {
    return async (dispatch, getState) => {
        const {id: _id, name} = getState().auth;

        try {
            const resp = await fetchWithToken("events", event, "POST");
            const data = await resp.json();

            if (data.ok) {
                event.id = data.event._id;
                event.user = {_id, name};
                dispatch(eventAddNew(event));
                Swal.fire(
                    "Saved",
                    `'${event.title}' has been saved successfully.`,
                    "success"
                );
            } else {
                const msgError = data.msg || extractErrorMessage(data) || "Please, contact the administrator";
                Swal.fire("Error", msgError, "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Please, contact the administrator", "error");
        }
    };
};

export const eventStartUpdate = (event) => {
    return async (dispatch) => {
        try {
            const resp = await fetchWithToken(`events/${event.id}`, event, "PUT");
            const data = await resp.json();

            if (data.ok) {
                dispatch(eventUpdate(event));
                Swal.fire(
                    "Updated",
                    `'${event.title}' has been updated successfully.`,
                    "success"
                );
            } else {
                const msgError = data.msg || extractErrorMessage(data) || "Please, contact the administrator";
                Swal.fire("Error", msgError, "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Please, contact the administrator", "error");
        }
    };
};

export const eventStartDelete = () => {
    return async (dispatch, getState) => {
        const {id} = getState().calendar.activeEvent;

        try {
            const resp = await fetchWithToken(`events/${id}`, {}, "DELETE");
            const data = await resp.json();

            if (data.ok) {
                dispatch(eventDelete(id));
                Swal.fire(
                    "Deleted",
                    `The event has been deleted successfully.`,
                    "success"
                );
            } else {
                const msgError = data.msg || extractErrorMessage(data) || "Please, contact the administrator";
                Swal.fire("Error", msgError, "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Please, contact the administrator", "error");
        }
    };
};

const extractErrorMessage = (data) => {
    if (data.errors) {
        const firstKey = Object.keys(data.errors)[0];
        return data.errors[firstKey]?.msg;
    }
    return null;
};

const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events,
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event,
});

export const eventClearActive = () => ({
    type: types.eventClearActive,
});

const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event,
});

const eventUpdate = (event) => ({
    type: types.eventUpdate,
    payload: event,
});

const eventDelete = (id) => ({
    type: types.eventDelete,
    payload: id,
});

export const eventLogout = () => ({
    type: types.eventClearLogout,
});
