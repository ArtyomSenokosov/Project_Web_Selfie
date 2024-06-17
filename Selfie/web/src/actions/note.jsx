import {fetchWithToken} from '../helpers/fetch';
import {ADD_NOTE, DELETE_NOTE, SET_NOTES, UPDATE_NOTE} from '../reducers/notesReducer';

const setNotes = (notes) => ({
    type: SET_NOTES,
    payload: notes
});

const addNote = (note) => ({
    type: ADD_NOTE,
    payload: note
});

export const startLoadingNotes = () => async (dispatch) => {
    const resp = await fetchWithToken('notes');
    const body = await resp.json();
    if (body.ok) {
        dispatch(setNotes(body.notes));
    } else {
        throw new Error(body.msg || 'Failed to load notes');
    }
};

export const startCreatingNote = (note) => async (dispatch) => {
    const resp = await fetchWithToken('notes', note, 'POST');
    const body = await resp.json();
    if (body.ok) {
        dispatch(addNote(body.note));
    } else {
        throw new Error(body.msg || 'Failed to create note');
    }
};

export const startDeletingNote = (id) => async (dispatch) => {
    try {
        const response = await fetchWithToken(`notes/${id}`, {}, 'DELETE');
        if (response.ok) {
            dispatch({type: DELETE_NOTE, payload: id});
            return Promise.resolve();
        } else {
            const errorData = await response.json();
            return Promise.reject(new Error(errorData.msg || 'Failed to delete note'));
        }
    } catch (error) {
        return Promise.reject(error);
    }
};

export const startSavingNote = (note) => async (dispatch) => {
    try {
        const response = await fetchWithToken(`notes/${note.id}`, note, 'PUT');
        const data = await response.json();
        if (data.ok) {
            dispatch({type: UPDATE_NOTE, payload: data.note});
        } else {
            throw new Error(data.msg || 'Failed to update note');
        }
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
};
