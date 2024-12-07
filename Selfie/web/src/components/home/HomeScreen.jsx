import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import Navbar from "../ui/Navbar";
import {eventStartLoading} from "../../actions/event";
import {startLoadingNotes} from "../../actions/note";
import {fetchTasks} from "../../actions/tasks";
import "./home.css";

const HomeScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const events = useSelector((state) => state.calendar?.events || []);
    const notes = useSelector((state) => state.notes || []);
    const tasks = useSelector((state) => state.tasks?.tasks || []);
    const [sortedNotes, setSortedNotes] = useState([]);

    const pomodoroState = useSelector((state) => ({
        timeLeft: state.pomodoro?.timeLeft || 0,
        isWorkPhase: state.pomodoro?.isWorkPhase || false,
        currentCycle: state.pomodoro?.currentCycle || 0,
        isRunning: state.pomodoro?.isRunning || false,
    }));

    useEffect(() => {
        dispatch(eventStartLoading());
        dispatch(startLoadingNotes());
        dispatch(fetchTasks());
    }, [dispatch]);

    useEffect(() => {
        const sorted = [...notes].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSortedNotes(sorted);
    }, [notes]);

    const formatTime = (ms) => {
        if (isNaN(ms) || ms <= 0) return "00:00";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const upcomingEvents = events.filter((event) => {
        const now = new Date();
        const eventDate = new Date(event.start);
        return eventDate >= now;
    });

    return (
        <div>
            <Navbar/>
            <div className="page-container">
                <div className="widgets-container">
                    <div className="widget-box" onClick={() => navigate("/calendar")}>
                        <div className="widget-title">
                            <span className="widget-icon">📅</span>
                            Calendar
                        </div>
                        <div className="widget-preview">
                            {upcomingEvents.length > 0 ? (
                                <>
                                    <p><strong>Next Event:</strong> {upcomingEvents[0].title}</p>
                                    <p>{new Date(upcomingEvents[0].start).toLocaleString()}</p>
                                </>
                            ) : (
                                <p>No upcoming events</p>
                            )}
                        </div>
                    </div>

                    <div className="widget-box" onClick={() => navigate("/notes")}>
                        <div className="widget-title">
                            <span className="widget-icon">📝</span>
                            Notes
                        </div>
                        <div className="widget-preview">
                            <p><strong>Total Notes:</strong> {notes.length}</p>
                            <div className="notes-preview-container">
                                {sortedNotes.slice(0, 5).map((note) => (
                                    <div key={note._id} className="note-preview">
                                        <h4>{note.title}</h4>
                                        <p>{note.text.substring(0, 200)}...</p>
                                        <p>
                                            <em>Created: {new Date(note.createdAt).toLocaleDateString()}</em>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="widget-box" onClick={() => navigate("/pomodoro")}>
                        <div className="widget-title">
                            <span className="widget-icon">⏱️</span>
                            Pomodoro
                        </div>
                        <div className="widget-preview">
                            {pomodoroState?.timeLeft > 0 ? (
                                <>
                                    <p><strong>Pomodoro Active:</strong></p>
                                    <p>Remaining Time: {formatTime(pomodoroState.timeLeft)}</p>
                                    <p>Phase: {pomodoroState.isWorkPhase ? "Work" : "Break"}</p>
                                    <p>Cycle: {pomodoroState.currentCycle}</p>
                                </>
                            ) : (
                                <p>No active pomodoro sessions</p>
                            )}
                        </div>
                    </div>

                    <div className="widget-box" onClick={() => navigate("/tasks")}>
                        <div className="widget-title">
                            <span className="widget-icon">✅</span>
                            Tasks
                        </div>
                        <div className="widget-preview">
                            <p><strong>Total Tasks:</strong> {tasks.length}</p>
                            {tasks.slice(0, 3).map((task) => (
                                <p key={task._id}>
                                    {task.title.length > 50 ? `${task.title.substring(0, 50)}...` : task.title}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
