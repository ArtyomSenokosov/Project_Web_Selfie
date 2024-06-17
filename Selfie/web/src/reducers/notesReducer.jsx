export const SET_NOTES = 'SET_NOTES';
export const ADD_NOTE = 'ADD_NOTE';
export const UPDATE_NOTE = 'UPDATE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const SET_CURRENT_NOTE = 'SET_CURRENT_NOTE';

const notesReducer = (state = [], action) => {
    switch (action.type) {
        case SET_NOTES:
            return action.payload;
        case ADD_NOTE:
            return [...state, action.payload];
        case DELETE_NOTE:
            return state.filter(note => note._id !== action.payload);
        case UPDATE_NOTE:
            return state.map(note =>
                note._id === action.payload._id ? {...note, ...action.payload} : note
            );
        case SET_CURRENT_NOTE:
            return {
                ...state,
                currentNote: action.payload
            };
        default:
            return state;
    }
};

export default notesReducer;
