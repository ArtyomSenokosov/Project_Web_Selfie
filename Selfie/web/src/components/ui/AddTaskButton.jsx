import React from "react";
import PlusIcon from "./icons/PlusIcon";

const AddTaskButton = ({onClick}) => {
    return (
        <button
            className="btn btn-primary btn--floating btn--floating-right"
            onClick={onClick}
        >
            <PlusIcon/>
        </button>
    );
};

export default AddTaskButton;
