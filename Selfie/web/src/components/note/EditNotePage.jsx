import React, {useState, useEffect} from 'react';
import Navbar from '../ui/Navbar';
import {useParams, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {startLoadingNotes, startSavingNote} from '../../actions/note';
import './note.css';

export const EditNotePage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const note = useSelector(state => state.notes.find(n => n._id === id));
    const [title, setTitle] = useState(note ? note.title : '');
    const [text, setText] = useState(note ? note.text : '');

    useEffect(() => {
        if (!note) {
            dispatch(startLoadingNotes());
        }
    }, [dispatch, note]);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleTextChange = (e) => setText(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(startSavingNote({
            id,
            title,
            text
        }));
        navigate('/notes');
    };

    return (
        <div className="notes-page-container">
            <Navbar/>
            <div className="form-page-container">
                <div className="form-container">
                    <h1>Edit Note</h1>
                    <form onSubmit={handleSubmit} className="note-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={title} onChange={handleTitleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Text</label>
                            <textarea value={text} onChange={handleTextChange} required/>
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
