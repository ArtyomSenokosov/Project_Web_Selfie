import {pomodoroTypes} from "../actions/pomodoro";
import {setNotification} from "./notificationsReducer";
import {saveToLocalStorage} from "../utils/localStorageUtils";

let timerInterval = null;

export const pomodoroMiddleware = (store) => (next) => (action) => {
    const {dispatch, getState} = store;

    const stopTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    };

    const synchronizeTimer = () => {
        const {
            isRunning,
            lastUpdated,
            timeLeft,
        } = getState().pomodoro;

        if (!isRunning || !lastUpdated) return;

        const currentTime = Date.now();
        const elapsed = currentTime - lastUpdated;

        if (elapsed >= timeLeft) {
            dispatch({type: pomodoroTypes.SWITCH_PHASE});
        } else {
            dispatch({
                type: pomodoroTypes.REDUCE_TIME,
                payload: elapsed,
            });

            dispatch({
                type: pomodoroTypes.UPDATE_LAST_UPDATED,
                payload: currentTime,
            });
        }

        saveToLocalStorage("pomodoroState", getState().pomodoro);
    };

    const startTimer = () => {
        stopTimer();
        timerInterval = setInterval(() => {
            synchronizeTimer();
        }, 1000);
    };

    switch (action.type) {
        case pomodoroTypes.START_TIMER:
            dispatch({
                type: pomodoroTypes.UPDATE_LAST_UPDATED,
                payload: Date.now(),
            });
            startTimer();
            dispatch(setNotification("Timer started", "info"));
            break;

        case pomodoroTypes.PAUSE_TIMER:
            stopTimer();
            dispatch(setNotification("Timer paused", "info"));
            break;

        case pomodoroTypes.RESET_TIMER:
            stopTimer();
            dispatch(setNotification("Timer reset", "info"));
            break;

        case pomodoroTypes.RESTORE_STATE: {
            const {isRunning} = getState().pomodoro;
            if (isRunning) {
                synchronizeTimer();
                startTimer();
            }
            break;
        }

        case pomodoroTypes.UPDATE_SETTINGS:
            dispatch(setNotification("Settings updated", "success"));
            break;

        case pomodoroTypes.CALCULATE_TIME:
            dispatch(setNotification("Time calculated", "info"));
            break;

        default:
            break;
    }

    return next(action);
};
