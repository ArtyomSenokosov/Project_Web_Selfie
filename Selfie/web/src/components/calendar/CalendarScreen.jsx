import {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";

import Navbar from "../ui/Navbar";
import CalendarEvent from "./CalendarEvent";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import CalendarModal from "./CalendarModal";
import {useDispatch, useSelector} from "react-redux";
import {uiOpenModal} from "../../actions/ui";
import {
    eventClearActive,
    eventSetActive,
    eventStartLoading,
} from "../../actions/event";
import AddNewBtn from "../ui/AddNewBtn";
import DeleteBtn from "../ui/DeleteBtn";

const localizer = momentLocalizer(moment);

const getNextOccurrences = (event, fromDate, count = 2) => {
    const occurrences = [];
    let currentDate = moment(fromDate);

    while (occurrences.length < count) {
        if (event.frequency === 'daily') {
            currentDate.add(1, 'day');
        } else if (event.frequency === 'weekly') {
            currentDate.add(1, 'week');
        } else if (event.frequency === 'monthly') {
            currentDate.add(1, 'month');
        } else if (event.frequency === 'yearly') {
            currentDate.add(1, 'year');
        }

        if (currentDate.isAfter(fromDate)) {
            occurrences.push({
                ...event,
                start: currentDate.toDate(),
                end: moment(currentDate).add(moment(event.end).diff(event.start)).toDate(),
            });
        }
    }
    return occurrences;
};

const CalendarScreen = () => {
    const dispatch = useDispatch();
    const {calendar, auth, ui} = useSelector((state) => state);
    const {events, activeEvent} = calendar;
    const {id} = auth;
    const {modalOpen} = ui;
    const [lastView, setLastView] = useState(
        localStorage.getItem("lastView") || "month"
    );

    useEffect(() => {
        dispatch(eventStartLoading());
    }, [dispatch]);

    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
    };

    const onSelect = (e) => {
        dispatch(eventSetActive(e));
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

    const eventStyleGetter = (event) => {
        let backgroundColor = "#465660";
        if (event.user && event.user._id && id === event.user._id) {
            backgroundColor = event.status === 'completed' ? "green" : "#367CF7";
        }

        const style = {
            backgroundColor: backgroundColor,
            opacity: 0.8,
            display: "block",
            color: "white",
        };

        return {style};
    };

    const userEvents = events.filter(event => event.user && event.user._id && event.user._id === id);
    const processedEvents = userEvents.flatMap(event => {
        if (event.type === 'recurring') {
            return getNextOccurrences(event, moment(), 2);
        }
        return event;
    });

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
                    selectable={true}
                    view={lastView}
                    components={{event: CalendarEvent}}
                />
            </div>
            {activeEvent && !modalOpen && <DeleteBtn/>}
            <AddNewBtn/>
            <CalendarModal/>
        </div>
    );
};
export default CalendarScreen;
