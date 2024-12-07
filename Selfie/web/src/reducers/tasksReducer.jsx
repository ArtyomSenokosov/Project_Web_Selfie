import types from "../types";

const initialState = {
    tasks: [],
    activeTask: null,
    error: null,
};

export const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.tasksLoad:
            return {
                ...state,
                tasks: action.payload,
                error: null,
            };

        case types.tasksAdd:
            return {
                ...state,
                tasks: [action.payload, ...state.tasks],
                error: null,
            };

        case types.tasksUpdate:
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task._id === action.payload._id ? action.payload : task
                ),
                error: null,
            };

        case types.tasksDelete:
            return {
                ...state,
                tasks: state.tasks.filter((task) => task._id !== action.payload),
                error: null,
            };

        case types.tasksSetActive:
            return {
                ...state,
                activeTask: action.payload,
                error: null,
            };

        case types.tasksClearActive:
            return {
                ...state,
                activeTask: null,
                error: null,
            };

        case types.tasksError:
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default tasksReducer;
