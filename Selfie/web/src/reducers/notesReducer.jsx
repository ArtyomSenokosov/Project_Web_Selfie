import types from '../types';

const notesReducer = (state = [], action) => {
    switch (action.type) {
        case types.notesLoad:
            return [...action.payload];

        case types.notesAddNew:
            return [...state, action.payload];

        case types.notesUpdated:
            return state.map((note) =>
                note._id === action.payload._id ? action.payload : note
            );

        case types.notesDelete:
            return state.filter((note) => note._id !== action.payload);

        default:
            return state;
    }
};

export default notesReducer;
