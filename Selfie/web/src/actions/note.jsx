import {fetchWithToken} from '../helpers/fetch';
import types from '../types';
import Swal from 'sweetalert2';

export const startLoadingNotes = () => async (dispatch) => {
    try {
        const resp = await fetchWithToken('notes');
        const body = await resp.json();
        if (body.ok) {
            dispatch(loadNotes(body.notes));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: body.msg || 'Failed to load notes.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
};

export const loadNotes = (notes) => ({
    type: types.notesLoad,
    payload: notes,
});

export const startCreatingNote = (note) => async (dispatch) => {
    try {
        const resp = await fetchWithToken('notes', note, 'POST');
        const body = await resp.json();
        if (body.ok) {
            dispatch(addNote(body.note));
            Swal.fire({
                icon: 'success',
                title: 'Note Added',
                text: `'${body.note.title}' has been added successfully.`,
                timer: 3000,
                timerProgressBar: true,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: body.msg || 'Failed to add the note.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
};

export const addNote = (note) => ({
    type: types.notesAddNew,
    payload: note,
});

export const startSavingNote = (note) => async (dispatch) => {
    try {
        const resp = await fetchWithToken(`notes/${note._id}`, note, 'PUT');
        const body = await resp.json();

        if (body.ok) {
            dispatch(updateNote(body.note));
            Swal.fire({
                icon: 'success',
                title: 'Note Updated',
                text: `'${body.note.title}' has been updated successfully.`,
                timer: 3000,
                timerProgressBar: true,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: body.msg || 'Failed to update the note.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
};

export const updateNote = (note) => ({
    type: types.notesUpdated,
    payload: note,
});

export const startDeletingNote = (id) => async (dispatch) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
        try {
            const resp = await fetchWithToken(`notes/${id}`, {}, 'DELETE');
            const body = await resp.json();
            if (body.ok) {
                dispatch(deleteNote(id));
                Swal.fire({
                    icon: 'success',
                    title: 'Note Deleted',
                    text: 'The note has been deleted successfully.',
                    timer: 3000,
                    timerProgressBar: true,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: body.msg || 'Failed to delete the note.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    }
};

export const deleteNote = (id) => ({
    type: types.notesDelete,
    payload: id,
});
