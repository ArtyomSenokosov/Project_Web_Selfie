import types from "../types";

const initialState = {
    checking: true,
    id: null,
    name: null,
    firstName: '',
    lastName: '',
    birthDate: ''
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.authLogin:
            return {
                ...state,
                ...action.payload,
                checking: false
            };

        case types.authCheckingFinish:
            return {
                ...state,
                checking: false,
            };

        case types.authLogout:
            return {
                checking: false,
                id: null,
                name: null,
                firstName: '',
                lastName: '',
                birthDate: ''
            };

        default:
            return state;
    }
};

export default authReducer;
