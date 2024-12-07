import React from "react";
import {useDispatch} from "react-redux";
import {startDeletingTask, tasksSetActive} from "../../actions/tasks";
import DeleteIcon from "../ui/icons/DeleteIcon";
import "./tasks.css";

const TaskItem = ({task, onEdit}) => {
    const dispatch = useDispatch();

    const handleDelete = (e) => {
        e.stopPropagation();
        dispatch(startDeletingTask(task._id));
    };

    const handleEdit = () => {
        dispatch(tasksSetActive(task));
        if (onEdit) onEdit(task);
    };

    const taskClass = `task-item ${
        task.isCompleted
            ? "completed-task"
            : new Date(task.dueDate) < new Date()
                ? "overdue-task"
                : ""
    }`;

    return (
        <div className={taskClass} onClick={handleEdit}>
            <h3>{task.title}</h3>
            <p>{task.description || "No description provided"}</p>
            <p>
                Due Date:{" "}
                {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No deadline"}
            </p>
            <p>
                Priority:{" "}
                <span className={`priority-${task.priority.toLowerCase()}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
            </p>
            <p className="task-status">
                {task.isCompleted
                    ? "Status: Completed"
                    : new Date(task.dueDate) < new Date()
                        ? "Status: Overdue"
                        : ""}
            </p>
            <button className="delete-btn" onClick={handleDelete}>
                <DeleteIcon/>
            </button>
        </div>
    );
};

export default TaskItem;
