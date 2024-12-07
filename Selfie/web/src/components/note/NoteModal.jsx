import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {startCreatingNote, startSavingNote} from '../../actions/note';
import './note.css';

const NoteModal = ({isOpen, onClose, note}) => {
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState({
        title: '',
        text: '',
        categories: [],
    });
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        if (note) {
            setFormValues({
                title: note.title || '',
                text: note.text || '',
                categories: note.categories || [],
            });
        } else {
            setFormValues({
                title: '',
                text: '',
                categories: [],
            });
        }
    }, [note]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues((prev) => ({...prev, [name]: value}));
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setFormValues((prev) => ({
                ...prev,
                categories: [...prev.categories, newCategory.trim()],
            }));
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (index) => {
        setFormValues((prev) => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index),
        }));
    };

    const handleSave = async () => {
        if (!formValues.title.trim()) {
            alert('Note title is required!');
            return;
        }

        const noteData = {...formValues};

        try {
            if (note) {
                await dispatch(startSavingNote({...note, ...noteData}));
            } else {
                await dispatch(startCreatingNote(noteData));
            }
            onClose();
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal__background">
            <div className="modal">
                <h2>{note ? 'Edit Note' : 'Add Note'}</h2>
                <div className="form__field">
                    <label className="form__label">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form__input"
                        value={formValues.title}
                        onChange={handleInputChange}
                        placeholder="Enter note title"
                        required
                    />
                </div>
                <div className="form__field">
                    <label className="form__label">Content</label>
                    <textarea
                        name="text"
                        className="form__text-area"
                        value={formValues.text}
                        onChange={handleInputChange}
                        placeholder="Enter note content"
                    />
                </div>
                <div className="form__field">
                    <label className="form__label">Categories</label>
                    <div className="categories-container">
                        {formValues.categories.map((category, index) => (
                            <div key={index} className="category-item">
                                <span>{category}</span>
                                <button
                                    type="button"
                                    className="remove-category-btn"
                                    onClick={() => handleRemoveCategory(index)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <div className="add-category-field">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Add a category"
                                className="form__input category-input"
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="add-category-btn"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
                <div className="modal__actions">
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;
