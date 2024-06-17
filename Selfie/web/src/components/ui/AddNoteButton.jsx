import React from 'react';
import {useNavigate} from 'react-router-dom';
import PlusIcon from './icons/PlusIcon';

const AddNoteButton = () => {
    const navigate = useNavigate();

    const handleAddNote = () => {
        navigate('/notes/add');
    };

    return (
        <button className="btn btn-primary btn--floating" onClick={handleAddNote}>
            <PlusIcon/>
        </button>
    );
};

export default AddNoteButton;
