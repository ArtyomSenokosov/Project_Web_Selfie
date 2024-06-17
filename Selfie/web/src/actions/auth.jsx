import {fetchNoToken, fetchWithToken} from "../helpers/fetch";
import types from "../types";
import Swal from "sweetalert2";
import {removeError, setError} from "./ui";
import {eventLogout} from "./event";

const handleAuthResponse = (dispatch, data) => {
    if (data.ok) {
        const {user, token} = data;
        const {_id: id, name, firstName, lastName, birthDate} = user;

        localStorage.setItem("token", token);
        localStorage.setItem("token-init-date", new Date().getTime());

        dispatch(
            login({
                id,
                name,
                firstName,
                lastName,
                birthDate
            })
        );
    } else {
        if (data.errors) dispatch(checkingErrors(data.errors));
        if (data.msg) Swal.fire("Error", data.msg, "error");
    }
};

const handleError = (err) => {
    console.log(err);
    Swal.fire("Error", "Please, contact the administrator", "error");
};

export const startLogin = (email, password) => {
    return async (dispatch) => {
        fetchNoToken("auth/login", {email, password}, "POST")
            .then((resp) => resp.json())
            .then((data) => handleAuthResponse(dispatch, data))
            .catch(handleError);
    };
};

export const startRegister = (name, email, password) => {
    return async (dispatch) => {
        fetchNoToken("auth/register", {name, email, password}, "POST")
            .then((resp) => resp.json())
            .then((data) => handleAuthResponse(dispatch, data))
            .catch(handleError);
    };
};

export const startChecking = () => {
    return async (dispatch) => {
        fetchWithToken("auth/renew")
            .then((resp) => resp.json())
            .then((data) => handleAuthResponse(dispatch, data))
            .catch(handleError)
            .finally(() => {
                dispatch(checkingFinish());
            });
    };
};

export const checkingErrors = (errors) => {
    return (dispatch) => {
        const {msg} = errors[Object.keys(errors)[0]];
        dispatch(setError(msg));
    };
};

const checkingFinish = () => ({
    type: types.authCheckingFinish,
});

const login = (user) => ({
    type: types.authLogin,
    payload: user,
});

export const startLogout = () => {
    return (dispatch) => {
        localStorage.clear();
        dispatch(removeError());
        dispatch(eventLogout());
        dispatch(logout());
    };
};

export const logout = () => ({
    type: types.authLogout,
});

export const updateProfile = (user) => {
    return async (dispatch) => {
        fetchWithToken("auth/update", user, "PUT")
            .then((resp) => resp.json())
            .then((data) => {
                if (data.ok) {
                    const {user} = data;
                    const {_id: id, name, firstName, lastName, birthDate} = user;

                    dispatch(
                        login({
                            id,
                            name,
                            firstName,
                            lastName,
                            birthDate
                        })
                    );

                    Swal.fire("Success", "Profile updated successfully", "success");
                } else {
                    if (data.errors) dispatch(checkingErrors(data.errors));
                    if (data.msg) Swal.fire("Error", data.msg, "error");
                }
            })
            .catch(handleError);
    };
};
