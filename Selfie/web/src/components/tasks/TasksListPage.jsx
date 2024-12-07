import React, {useEffect, useState, useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchTasks, startUpdatingTask} from "../../actions/tasks";
import Navbar from "../ui/Navbar";
import TaskModal from "./TaskModal";
import TaskItem from "./TaskItem";
import AddTaskButton from "../ui/AddTaskButton";
import "./tasks.css";

const TasksListPage = () => {
    const dispatch = useDispatch();
    const {tasks} = useSelector((state) => state.tasks);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTask, setActiveTask] = useState(null);

    const [filteredTasks, setFilteredTasks] = useState([]);
    const [sortOptions, setSortOptions] = useState({
        priority: false,
        date: false,
    });
    const [filterOption, setFilterOption] = useState("all");

    useEffect(() => {
        dispatch(fetchTasks()).catch((error) =>
            console.error("Failed to fetch tasks:", error)
        );
    }, [dispatch]);

    const applyFiltersAndSorting = useCallback(() => {
        let updatedTasks = [...tasks];

        if (filterOption === "completed") {
            updatedTasks = updatedTasks.filter((task) => task.isCompleted);
        } else if (filterOption === "overdue") {
            updatedTasks = updatedTasks.filter(
                (task) => !task.isCompleted && new Date(task.dueDate) < new Date()
            );
        }

        if (sortOptions.priority) {
            const priorityOrder = {high: 1, normal: 2, low: 3};
            updatedTasks.sort(
                (a, b) =>
                    priorityOrder[a.priority.toLowerCase()] -
                    priorityOrder[b.priority.toLowerCase()]
            );
        }
        if (sortOptions.date) {
            updatedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        }

        setFilteredTasks(updatedTasks);
    }, [tasks, filterOption, sortOptions]);

    useEffect(() => {
        applyFiltersAndSorting();
    }, [applyFiltersAndSorting]);

    const toggleSortOption = (option) => {
        setSortOptions((prevOptions) => ({
            ...prevOptions,
            [option]: !prevOptions[option],
        }));
    };

    const handleAddTask = () => {
        setActiveTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setActiveTask(task);
        setIsModalOpen(true);
    };

    const handleTaskUpdate = async (updatedTask) => {
        try {
            await dispatch(startUpdatingTask(updatedTask));
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    return (
        <div className="tasks-page-container">
            <Navbar/>
            <div className="tasks-filters">
                <button
                    className={`filter-btn ${filterOption === "all" ? "active" : ""}`}
                    onClick={() => setFilterOption("all")}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${
                        filterOption === "completed" ? "active" : ""
                    }`}
                    onClick={() => setFilterOption("completed")}
                >
                    Completed
                </button>
                <button
                    className={`filter-btn ${
                        filterOption === "overdue" ? "active" : ""
                    }`}
                    onClick={() => setFilterOption("overdue")}
                >
                    Overdue
                </button>
                <button
                    className={`filter-btn ${sortOptions.priority ? "active" : ""}`}
                    onClick={() => toggleSortOption("priority")}
                >
                    Sort by Priority
                </button>
                <button
                    className={`filter-btn ${sortOptions.date ? "active" : ""}`}
                    onClick={() => toggleSortOption("date")}
                >
                    Sort by Date
                </button>
            </div>
            <div className="tasks-list">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onEdit={() => handleEditTask(task)}
                        />
                    ))
                ) : (
                    <p>No tasks available</p>
                )}
            </div>
            <AddTaskButton onClick={handleAddTask}/>
            {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    task={activeTask}
                    onSave={handleTaskUpdate}
                />
            )}
        </div>
    );
};

export default TasksListPage;
