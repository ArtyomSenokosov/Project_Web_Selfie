import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {startAddingTask, startUpdatingTask} from "../../actions/tasks";
import "./tasks.css";

const TaskModal = ({isOpen, onClose, task}) => {
    const dispatch = useDispatch();

    const [formValues, setFormValues] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "normal",
        isCompleted: false,
    });

    useEffect(() => {
        if (task) {
            setFormValues((prev) => ({
                ...prev,
                title: task.title || "",
                description: task.description || "",
                dueDate: task.dueDate || "",
                priority: task.priority || "normal",
                isCompleted: task.isCompleted || false,
            }));
        } else {
            setFormValues({
                title: "",
                description: "",
                dueDate: "",
                priority: "normal",
                isCompleted: false,
            });
        }
    }, [task]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const {checked} = e.target;
        setFormValues((prev) => ({
            ...prev,
            isCompleted: checked,
        }));
    };

    const handleSave = async () => {
        if (!formValues.title.trim()) {
            alert("Task title is required!");
            return;
        }

        try {
            if (task) {
                await dispatch(startUpdatingTask({...task, ...formValues}));
            } else {
                await dispatch(startAddingTask(formValues));
            }
            onClose();
        } catch (error) {
            console.error("Failed to save task:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal__background">
            <div className="modal">
                <h2>{task ? "Edit Task" : "Add Task"}</h2>
                <div className="form__field">
                    <label className="form__label">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form__input"
                        value={formValues.title}
                        onChange={handleInputChange}
                        placeholder="Enter task title"
                        required
                    />
                </div>
                <div className="form__field">
                    <label className="form__label">Description</label>
                    <textarea
                        name="description"
                        className="form__text-area"
                        value={formValues.description}
                        onChange={handleInputChange}
                        placeholder="Enter task description"
                    />
                </div>
                <div className="form__field">
                    <label className="form__label">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        className="form__input"
                        value={formValues.dueDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form__field">
                    <label className="form__label">Priority</label>
                    <select
                        name="priority"
                        className="form__input"
                        value={formValues.priority}
                        onChange={handleInputChange}
                    >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="form__field">
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            className="checkbox-input"
                            checked={formValues.isCompleted}
                            onChange={handleCheckboxChange}
                        />
                        <span className="checkbox-label"></span>
                        Mark as Completed
                    </label>
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

export default TaskModal;
