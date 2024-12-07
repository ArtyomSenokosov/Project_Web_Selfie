const initialState = {
    notifications: [],
};

export const notificationsActionTypes = {
    SET_NOTIFICATION: "SET_NOTIFICATION",
    CLEAR_NOTIFICATION: "CLEAR_NOTIFICATION",
    REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
};

export const notificationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case notificationsActionTypes.SET_NOTIFICATION:
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    {
                        id: Date.now(),
                        message: action.payload.message,
                        type: action.payload.type,
                    },
                ],
            };

        case notificationsActionTypes.REMOVE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(
                    (notification) => notification.id !== action.payload
                ),
            };

        case notificationsActionTypes.CLEAR_NOTIFICATION:
            return initialState;

        default:
            return state;
    }
};

export const setNotification = (message, type = "info") => ({
    type: notificationsActionTypes.SET_NOTIFICATION,
    payload: {message, type},
});

export const removeNotification = (id) => ({
    type: notificationsActionTypes.REMOVE_NOTIFICATION,
    payload: id,
});
