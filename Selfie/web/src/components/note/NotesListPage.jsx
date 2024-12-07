import Navbar from '../ui/Navbar';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {startLoadingNotes, startDeletingNote, startCreatingNote} from '../../actions/note';
import './note.css';
import NoteModal from './NoteModal';
import AddNoteButton from '../ui/AddNoteButton';
import DeleteIcon from '../ui/icons/DeleteIcon';

export const NotesListPage = () => {
    const dispatch = useDispatch();
    const notes = useSelector((state) => state.notes);
    const [sortOption, setSortOption] = useState('title');
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeNote, setActiveNote] = useState(null);

    useEffect(() => {
        dispatch(startLoadingNotes());
    }, [dispatch]);

    useEffect(() => {
        const sortedNotes = [...notes].sort((a, b) => {
            if (sortOption === 'title') return a.title.localeCompare(b.title);
            if (sortOption === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOption === 'length') return b.text.length - a.text.length;
            return 0;
        });
        setFilteredNotes(sortedNotes);
    }, [notes, sortOption]);

    const handleDelete = async (id, event) => {
        event.stopPropagation();
        dispatch(startDeletingNote(id));
    };

    const handleDuplicate = (note, event) => {
        event.stopPropagation();
        const duplicatedNote = {
            ...note,
            title: `${note.title} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        delete duplicatedNote._id;
        dispatch(startCreatingNote(duplicatedNote));
    };

    const handleAddNote = () => {
        setActiveNote(null);
        setIsModalOpen(true);
    };

    const handleEditNote = (note) => {
        setActiveNote(note);
        setIsModalOpen(true);
    };

    return (
        <div className="notes-page-container">
            <Navbar/>
            <div className="notes-filters">
                <button
                    className={`filter-btn ${sortOption === 'title' ? 'active' : ''}`}
                    onClick={() => setSortOption('title')}
                >
                    Sort by Title
                </button>
                <button
                    className={`filter-btn ${sortOption === 'date' ? 'active' : ''}`}
                    onClick={() => setSortOption('date')}
                >
                    Sort by Date
                </button>
                <button
                    className={`filter-btn ${sortOption === 'length' ? 'active' : ''}`}
                    onClick={() => setSortOption('length')}
                >
                    Sort by Length
                </button>
            </div>
            <div className="notes-list">
                {filteredNotes.map((note) => (
                    <div key={note._id} className="note-item" onClick={() => handleEditNote(note)}>
                        <h3>{note.title.length > 30 ? note.title.substring(0, 30) + '...' : note.title}</h3>
                        <p>{note.text.length > 70 ? note.text.substring(0, 70) + '...' : note.text}</p>
                        <div className="categories">
                            {note.categories &&
                                note.categories.map((category, index) => (
                                    <span key={index} className="category">
                                        {category}
                                    </span>
                                ))}
                        </div>
                        <div className="note-actions">
                            <button onClick={(e) => handleDuplicate(note, e)} className="duplicate-btn">
                                Duplicate
                            </button>
                            <button
                                onClick={(e) => handleDelete(note._id, e)}
                                className="delete-btn"
                            >
                                <DeleteIcon/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <AddNoteButton onAdd={handleAddNote}/>
            {isModalOpen && (
                <NoteModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    note={activeNote}
                />
            )}
        </div>
    );
};
