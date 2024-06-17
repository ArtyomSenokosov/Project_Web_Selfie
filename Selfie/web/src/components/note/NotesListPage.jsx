import Navbar from '../ui/Navbar';
import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {startLoadingNotes, startDeletingNote} from '../../actions/note';
import './note.css';
import AddNoteButton from '../ui/AddNoteButton';

export const NotesListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notes = useSelector(state => state.notes);

    useEffect(() => {
        dispatch(startLoadingNotes());
    }, [dispatch]);

    const handleDelete = (id, event) => {
        event.stopPropagation();
        if (window.confirm("Are you sure you want to delete this note?")) {
            dispatch(startDeletingNote(id))
                .then(() => {
                    alert('Note deleted successfully');
                    navigate('/notes');
                })
                .catch(error => {
                    alert('Failed to delete note: ' + error.message);
                });
        }
    };

    return (
        <div className="notes-page-container">
            <Navbar/>
            {notes.map(note => (
                <div key={note._id} className="note-item">
                    <div className="note-content" onClick={() => navigate(`/notes/edit/${note._id}`)}>
                        {note.title}
                    </div>
                    <button onClick={(e) => handleDelete(note._id, e)} className="delete-btn">Delete</button>
                </div>
            ))}
            <AddNoteButton/>
        </div>
    );
};
