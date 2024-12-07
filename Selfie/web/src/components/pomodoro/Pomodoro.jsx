import React, {useEffect, useState} from "react";
import Navbar from "../ui/Navbar";
import {useDispatch, useSelector} from "react-redux";
import {
    startTimer,
    pauseTimer,
    resetTimer,
    switchPhase,
    updateSettings,
    restoreState,
    updateLastUpdated,
    endCurrentCycle,
    calculateTime,
} from "../../actions/pomodoro";
import {setNotification} from "../../reducers/notificationsReducer";
import {saveToLocalStorage, loadFromLocalStorage} from "../../utils/localStorageUtils";
import "./Pomodoro.css";

const Pomodoro = () => {
    const dispatch = useDispatch();
    const {
        workTime,
        breakTime,
        cycles,
        currentCycle,
        isRunning,
        isWorkPhase,
        timeLeft,
        lastUpdated,
    } = useSelector((state) => state.pomodoro);

    const [localWorkTime, setLocalWorkTime] = useState(workTime / 60000);
    const [localBreakTime, setLocalBreakTime] = useState(breakTime / 60000);
    const [localCycles, setLocalCycles] = useState(cycles);
    const [totalTime, setTotalTime] = useState(() => {
        const savedTotalTime = loadFromLocalStorage("pomodoroTotalTime");
        return savedTotalTime ? parseInt(savedTotalTime, 10) : 0;
    });
    const [workPercentage, setWorkPercentage] = useState(() => {
        const savedWorkPercentage = loadFromLocalStorage("pomodoroWorkPercentage");
        return savedWorkPercentage ? parseInt(savedWorkPercentage, 10) : 50;
    });

    const formatTime = (ms) => {
        if (isNaN(ms) || ms <= 0) return "00:00";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        const savedState = loadFromLocalStorage("pomodoroState");
        if (savedState) {
            const elapsed = savedState.isRunning ? Date.now() - savedState.lastUpdated : 0;
            const updatedTimeLeft = Math.max(savedState.timeLeft - elapsed, 0);

            dispatch(
                restoreState({
                    ...savedState,
                    timeLeft: updatedTimeLeft,
                    isRunning: savedState.isRunning && updatedTimeLeft > 0,
                })
            );

            setLocalWorkTime(savedState.workTime / 60000);
            setLocalBreakTime(savedState.breakTime / 60000);
            setLocalCycles(savedState.cycles);
        }
    }, [dispatch]);

    useEffect(() => {
        saveToLocalStorage("pomodoroState", {
            workTime,
            breakTime,
            cycles,
            currentCycle,
            isRunning,
            isWorkPhase,
            timeLeft,
            lastUpdated,
        });
    }, [workTime, breakTime, cycles, currentCycle, isRunning, isWorkPhase, timeLeft, lastUpdated]);

    useEffect(() => {
        saveToLocalStorage("pomodoroTotalTime", totalTime);
        saveToLocalStorage("pomodoroWorkPercentage", workPercentage);
    }, [totalTime, workPercentage]);

    const applySettings = () => {
        dispatch(
            updateSettings({
                workTime: localWorkTime * 60000,
                breakTime: localBreakTime * 60000,
                cycles: parseInt(localCycles, 10),
            })
        );
        dispatch(resetTimer());
        dispatch(setNotification("Settings applied!", "info"));
    };

    const handleCalculateTime = () => {
        if (cycles <= 0) {
            dispatch(setNotification("Number of cycles must be greater than 0", "error"));
            return;
        }

        const totalTimeMs = totalTime * 60 * 1000;
        const totalCycleTime = totalTimeMs / cycles;
        const workTime = (totalCycleTime * workPercentage) / 100;
        const breakTime = totalCycleTime - workTime;

        if (workTime <= 0 || breakTime <= 0) {
            dispatch(setNotification("Invalid time distribution. Adjust percentages or total time.", "error"));
            return;
        }

        dispatch(calculateTime(totalTimeMs, workPercentage));
        dispatch(
            setNotification(
                `Work Time: ${(workTime / 60000).toFixed(2)} min, Break Time: ${(breakTime / 60000).toFixed(2)} min per cycle`,
                "info"
            )
        );
    };

    const handleStart = () => {
        dispatch(startTimer());
        dispatch(updateLastUpdated(Date.now()));
    };

    const handlePause = () => {
        dispatch(pauseTimer());
        dispatch(setNotification("Timer paused", "info"));
    };

    const handleReset = () => {
        dispatch(resetTimer());
        dispatch(setNotification("Timer reset", "info"));
    };

    const handleNextPhase = () => {
        dispatch(switchPhase());
        dispatch(setNotification("Next phase activated", "info"));
    };

    const handleStandardSettings = () => {
        setLocalWorkTime(25);
        setLocalBreakTime(5);
        setLocalCycles(4);
        dispatch(
            updateSettings({
                workTime: 25 * 60000,
                breakTime: 5 * 60000,
                cycles: 4,
            })
        );
        dispatch(resetTimer());
        dispatch(setNotification("Standard settings applied", "info"));
    };

    const handleEndCycle = () => {
        dispatch(endCurrentCycle());
        dispatch(setNotification(`Cycle ${currentCycle} ended. Moving to next cycle.`, "info"));
    };

    return (
        <div className="pomodoro-app">
            <Navbar/>
            <div className="pomodoro-container">
                <h1 className="pomodoro-title">Pomodoro</h1>

                <div className="pomodoro-timer">
                    <div className="pomodoro-time">{formatTime(timeLeft)}</div>
                    <div className="pomodoro-phase">
                        {isWorkPhase ? "Work Phase" : "Break Phase"}
                    </div>
                </div>

                <div className="pomodoro-cycle-status">
                    Cycle: {currentCycle} / {cycles}
                </div>

                <div className="pomodoro-settings">
                    <h2>Settings</h2>
                    <label>
                        Work Time (minutes):
                        <input
                            type="number"
                            value={localWorkTime}
                            onChange={(e) => setLocalWorkTime(parseInt(e.target.value, 10))}
                        />
                    </label>
                    <label>
                        Break Time (minutes):
                        <input
                            type="number"
                            value={localBreakTime}
                            onChange={(e) => setLocalBreakTime(parseInt(e.target.value, 10))}
                        />
                    </label>
                    <label>
                        Cycles:
                        <input
                            type="number"
                            value={localCycles}
                            onChange={(e) => setLocalCycles(parseInt(e.target.value, 10))}
                        />
                    </label>
                    <button onClick={applySettings}>Apply</button>
                    <button onClick={handleStandardSettings}>Standard</button>
                </div>

                <div className="pomodoro-calculator">
                    <h2>Calculate Time</h2>
                    <label>
                        Total Time (minutes):
                        <input
                            type="number"
                            value={totalTime}
                            onChange={(e) => setTotalTime(parseInt(e.target.value, 10))}
                        />
                    </label>
                    <label>
                        Work Percentage (%):
                        <input
                            type="number"
                            value={workPercentage}
                            onChange={(e) => setWorkPercentage(parseInt(e.target.value, 10))}
                        />
                    </label>
                    <button onClick={handleCalculateTime}>Calculate</button>
                </div>

                <div className="pomodoro-buttons">
                    <button onClick={handleStart} disabled={isRunning}>
                        Start
                    </button>
                    <button onClick={handlePause} disabled={!isRunning}>
                        Pause
                    </button>
                    <button onClick={handleReset}>Reset</button>
                    <button onClick={handleNextPhase}>Next Phase</button>
                    <button onClick={handleEndCycle}>End Cycle</button>
                </div>
            </div>
        </div>
    );
};

export default Pomodoro;
