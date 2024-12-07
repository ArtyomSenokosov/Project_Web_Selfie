import types from "../types";
import {fetchWithToken} from "../helpers/fetch";
import Swal from "sweetalert2";

export const fetchTasks = () => async (dispatch) => {
    try {
        const response = await fetchWithToken("tasks");
        const data = await response.json();

        if (data.ok) {
            dispatch(tasksLoad(data.tasks));
        } else {
            dispatch(tasksError(data.msg || "Failed to load tasks"));
        }
    } catch (error) {
        dispatch(tasksError(error.message));
    }
};

export const startAddingTask = (task) => async (dispatch) => {
    try {
        const response = await fetchWithToken("tasks", task, "POST");
        const data = await response.json();

        if (data.ok) {
            dispatch(tasksAdd(data.task));
            Swal.fire({
                icon: "success",
                title: "Task Added",
                text: `'${data.task.title}' has been added successfully.`,
                timer: 3000,
                timerProgressBar: true,
            });
        } else {
            dispatch(tasksError(data.msg || "Failed to add task"));
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.msg || "Failed to add task.",
            });
        }
    } catch (error) {
        dispatch(tasksError(error.message));
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
        });
    }
};

export const startUpdatingTask = (task) => async (dispatch) => {
    try {
        const response = await fetchWithToken(`tasks/${task._id}`, task, "PUT");
        const data = await response.json();

        if (data.ok) {
            dispatch(tasksUpdate(data.task));
            Swal.fire({
                icon: "success",
                title: "Task Updated",
                text: `'${data.task.title}' has been updated successfully.`,
                timer: 3000,
                timerProgressBar: true,
            });
        } else {
            dispatch(tasksError(data.msg || "Failed to update task"));
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.msg || "Failed to update task.",
            });
        }
    } catch (error) {
        dispatch(tasksError(error.message));
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
        });
    }
};

export const startDeletingTask = (id) => async (dispatch) => {
    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            const response = await fetchWithToken(`tasks/${id}`, {}, "DELETE");
            const data = await response.json();

            if (data.ok) {
                dispatch(tasksDelete(id));
                Swal.fire({
                    icon: "success",
                    title: "Task Deleted",
                    text: "The task has been deleted successfully.",
                    timer: 3000,
                    timerProgressBar: true,
                });
            } else {
                dispatch(tasksError(data.msg || "Failed to delete task"));
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.msg || "Failed to delete task.",
                });
            }
        }
    } catch (error) {
        dispatch(tasksError(error.message));
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
        });
    }
};

export const tasksLoad = (tasks) => ({
    type: types.tasksLoad,
    payload: tasks,
});

export const tasksAdd = (task) => ({
    type: types.tasksAdd,
    payload: task,
});

export const tasksUpdate = (task) => ({
    type: types.tasksUpdate,
    payload: task,
});

export const tasksDelete = (id) => ({
    type: types.tasksDelete,
    payload: id,
});

export const tasksSetActive = (task) => ({
    type: types.tasksSetActive,
    payload: task,
});

export const setActiveTask = (task) => (dispatch) => {
    dispatch(tasksSetActive(task));
};

export const tasksClearActive = () => ({
    type: types.tasksClearActive,
});

export const tasksError = (error) => ({
    type: types.tasksError,
    payload: error,
});
