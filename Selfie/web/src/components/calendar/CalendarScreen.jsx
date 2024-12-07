import {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";

import Navbar from "../ui/Navbar";
import CalendarEvent from "./CalendarEvent";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import CalendarModal from "./CalendarModal";
import TaskModal from "../tasks/TaskModal";
import {useDispatch, useSelector} from "react-redux";
import {uiOpenModal} from "../../actions/ui";
import {
    eventClearActive,
    eventSetActive,
    eventStartLoading,
} from "../../actions/event";
import {
    fetchTasks,
    setActiveTask,
    tasksClearActive,
    startDeletingTask,
} from "../../actions/tasks";
import AddNewBtn from "../ui/AddNewBtn";
import DeleteBtn from "../ui/DeleteBtn";

const localizer = momentLocalizer(moment);

const getNextOccurrences = (event, fromDate, count = 5) => {
    const occurrences = [];
    let currentDate = moment(event.start);

    while (currentDate.isBefore(fromDate, "day")) {
        occurrences.push({
            ...event,
            start: currentDate.toDate(),
            end: moment(currentDate)
                .add(moment(event.end).diff(event.start))
                .toDate(),
        });

        if (event.frequency === "daily") {
            currentDate.add(1, "day");
        } else if (event.frequency === "weekly") {
            currentDate.add(1, "week");
        } else if (event.frequency === "monthly") {
            currentDate.add(1, "month");
        } else if (event.frequency === "yearly") {
            currentDate.add(1, "year");
        }
    }

    for (let i = 0; i < count; i++) {
        occurrences.push({
            ...event,
            start: currentDate.toDate(),
            end: moment(currentDate)
                .add(moment(event.end).diff(event.start))
                .toDate(),
        });

        if (event.frequency === "daily") {
            currentDate.add(1, "day");
        } else if (event.frequency === "weekly") {
            currentDate.add(1, "week");
        } else if (event.frequency === "monthly") {
            currentDate.add(1, "month");
        } else if (event.frequency === "yearly") {
            currentDate.add(1, "year");
        }
    }

    return occurrences;
};

const CalendarScreen = () => {
    const dispatch = useDispatch();
    const {calendar, auth, tasks} = useSelector((state) => state);
    const {events, activeEvent} = calendar;
    const {id} = auth;
    const {tasks: tasksList = [], activeTask} = tasks;
    const [lastView, setLastView] = useState(
        localStorage.getItem("lastView") || "month"
    );
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    useEffect(() => {
        dispatch(eventStartLoading());
        dispatch(fetchTasks());
    }, [dispatch]);

    const onDoubleClick = (e) => {
        if (e.resource?.type === "task") {
            const task = tasksList.find((task) => task._id === e.resource.id);
            if (task) {
                dispatch(setActiveTask(task));
                setIsTaskModalOpen(true);
            }
        } else {
            dispatch(uiOpenModal());
        }
    };

    const onSelect = (e) => {
        if (e.resource?.type === "task") {
            const task = tasksList.find((task) => task._id === e.resource.id);
            if (task) {
                dispatch(setActiveTask(task));
            }
        } else {
            dispatch(eventSetActive(e));
        }
    };

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem("lastView", e);
    };

    const onSelectSlot = (e) => {
        activeEvent && dispatch(eventClearActive());
        if (e.action === "select" || e.action === "doubleClick") {
            dispatch(
                eventSetActive({
                    title: "",
                    notes: "",
                    start: e.start,
                    end: e.end,
                })
            );
            dispatch(uiOpenModal());
        }
    };

    const onDelete = () => {
        if (activeTask) {
            dispatch(startDeletingTask(activeTask._id));
            dispatch(tasksClearActive());
        } else if (activeEvent) {
            if (activeEvent.id) {
                dispatch(eventClearActive());
            }
        }
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = "#465660";
        if (event.resource?.type === "task") {
            backgroundColor =
                activeTask && activeTask._id === event.resource.id
                    ? "#ffa726"
                    : "#ffc107";
        } else if (event.type === "recurring") {
            backgroundColor = "#4caf50";
        } else if (event.type === "one-time") {
            backgroundColor = "#f44336";
        }
        if (event.status === "completed") {
            backgroundColor = "green";
        }

        const style = {
            backgroundColor,
            opacity: 0.8,
            display: "block",
            color: "white",
        };

        return {style};
    };

    const userEvents = events.filter(
        (event) => event.user && event.user._id && event.user._id === id
    );

    const processedEvents = [
        ...userEvents.flatMap((event) => {
            if (event.type === "recurring") {
                return getNextOccurrences(event, moment(), 5);
            }
            return event;
        }),
        ...(tasksList.length > 0
            ? tasksList.map((task) => ({
                title: task.title,
                start: new Date(task.dueDate),
                end: new Date(task.dueDate),
                allDay: true,
                resource: {type: "task", id: task._id},
            }))
            : []),
    ];

    const closeTaskModal = () => {
        setIsTaskModalOpen(false);
        dispatch(tasksClearActive());
    };

    return (
        <div className="calendar">
            <Navbar/>
            <div className="calendar__container">
                <Calendar
                    localizer={localizer}
                    events={processedEvents}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={eventStyleGetter}
                    onDoubleClickEvent={onDoubleClick}
                    onSelectEvent={onSelect}
                    onView={onViewChange}
                    onSelectSlot={onSelectSlot}
                    selectable
                    view={lastView}
                    components={{event: CalendarEvent}}
                />
            </div>
            {(activeEvent || activeTask) && <DeleteBtn onClick={onDelete}/>}
            <AddNewBtn/>
            <CalendarModal/>
            {isTaskModalOpen && activeTask && (
                <TaskModal
                    isOpen={isTaskModalOpen}
                    onClose={closeTaskModal}
                    task={activeTask}
                />
            )}
        </div>
    );
};

export default CalendarScreen;
