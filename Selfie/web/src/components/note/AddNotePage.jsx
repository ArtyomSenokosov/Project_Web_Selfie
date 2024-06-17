import React, {useState} from 'react';
import Navbar from '../ui/Navbar';
import {useDispatch} from 'react-redux';
import {startCreatingNote} from '../../actions/note';
import {useNavigate} from 'react-router-dom';
import './note.css';

export const AddNotePage = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(startCreatingNote({title, text}));
        navigate('/notes'); // Redirect after creation
    };

    return (
        <div className="notes-page-container">
            <Navbar/>
            <div className="form-page-container">
                <div className="form-container">
                    <h1>Add a New Note</h1>
                    <form onSubmit={handleSubmit} className="note-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={title} onChange={handleTitleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Text</label>
                            <textarea value={text} onChange={handleTextChange} required/>
                        </div>
                        <button type="submit">Add Note</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
