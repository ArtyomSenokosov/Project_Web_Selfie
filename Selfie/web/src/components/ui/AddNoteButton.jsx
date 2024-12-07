import React from 'react';
import PlusIcon from './icons/PlusIcon';

const AddNoteButton = ({onAdd}) => {
    return (
        <button className="btn btn-primary btn--floating" onClick={onAdd}>
            <PlusIcon/>
        </button>
    );
};

export default AddNoteButton;
