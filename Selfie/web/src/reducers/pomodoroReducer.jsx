import {pomodoroTypes} from "../actions/pomodoro";
import {loadFromLocalStorage} from "../utils/localStorageUtils";

const initialState = {
    workTime: 25 * 60 * 1000,
    breakTime: 5 * 60 * 1000,
    cycles: 4,
    timeLeft: 25 * 60 * 1000,
    isRunning: false,
    isWorkPhase: true,
    currentCycle: 1,
    lastUpdated: null,
};

const savedState = loadFromLocalStorage("pomodoroState");
const pomodoroInitialState = savedState ? {...initialState, ...savedState} : initialState;

const pomodoroReducer = (state = pomodoroInitialState, action) => {
    switch (action.type) {
        case pomodoroTypes.START_TIMER:
            return {
                ...state,
                isRunning: true,
                lastUpdated: Date.now(),
            };

        case pomodoroTypes.PAUSE_TIMER:
            return {
                ...state,
                isRunning: false,
                lastUpdated: Date.now(),
            };

        case pomodoroTypes.RESET_TIMER:
            return {
                ...state,
                isRunning: false,
                timeLeft: state.workTime,
                isWorkPhase: true,
                currentCycle: 1,
                lastUpdated: null,
            };

        case pomodoroTypes.SWITCH_PHASE: {
            console.log("Switching Phase:", state.isWorkPhase ? "Work -> Break" : "Break -> Work");

            if (state.isWorkPhase) {
                console.log("Setting breakTime for Break Phase:", state.breakTime);
                return {
                    ...state,
                    isWorkPhase: false,
                    timeLeft: state.breakTime,
                    lastUpdated: Date.now(),
                };
            } else {
                const nextCycle = state.currentCycle + 1;
                if (nextCycle > state.cycles) {
                    console.log("All cycles completed. Resetting to Work Phase.");
                    return {
                        ...state,
                        isRunning: false,
                        isWorkPhase: true,
                        timeLeft: state.workTime,
                        currentCycle: 1,
                        lastUpdated: null,
                    };
                }
                console.log("Setting workTime for Work Phase:", state.workTime);
                return {
                    ...state,
                    isWorkPhase: true,
                    timeLeft: state.workTime,
                    currentCycle: nextCycle,
                    lastUpdated: Date.now(),
                };
            }
        }

        case pomodoroTypes.REDUCE_TIME:
            return {
                ...state,
                timeLeft: Math.max(state.timeLeft - action.payload, 0),
            };

        case pomodoroTypes.UPDATE_SETTINGS: {
            const {workTime, breakTime, cycles} = action.payload;
            return {
                ...state,
                workTime: workTime !== undefined ? workTime : state.workTime,
                breakTime: breakTime !== undefined ? breakTime : state.breakTime,
                cycles: cycles !== undefined ? cycles : state.cycles,
                timeLeft: state.isWorkPhase ? workTime || state.workTime : breakTime || state.breakTime,
            };
        }

        case pomodoroTypes.RESTORE_STATE: {
            const elapsed = action.payload.isRunning
                ? Date.now() - action.payload.lastUpdated
                : 0;

            const updatedTimeLeft = Math.max(action.payload.timeLeft - elapsed, 0);

            return {
                ...state,
                ...action.payload,
                timeLeft: updatedTimeLeft,
                lastUpdated: action.payload.isRunning ? Date.now() : null,
            };
        }

        case pomodoroTypes.UPDATE_LAST_UPDATED:
            return {
                ...state,
                lastUpdated: action.payload,
            };

        case pomodoroTypes.END_CURRENT_CYCLE: {
            const nextCycle = state.currentCycle + 1;
            if (nextCycle > state.cycles) {
                return {
                    ...state,
                    isRunning: false,
                    isWorkPhase: true,
                    timeLeft: state.workTime,
                    currentCycle: 1,
                    lastUpdated: null,
                };
            }
            return {
                ...state,
                isRunning: false,
                isWorkPhase: true,
                timeLeft: state.workTime,
                currentCycle: nextCycle,
                lastUpdated: null,
            };
        }

        case pomodoroTypes.CALCULATE_TIME: {
            const {totalTime, workPercentage} = action.payload;
            const totalTimeMs = totalTime;
            const totalCycleTime = totalTimeMs / state.cycles;
            const workTime = (totalCycleTime * workPercentage) / 100;
            const breakTime = totalCycleTime - workTime;

            return {
                ...state,
                workTime,
                breakTime,
                timeLeft: state.isWorkPhase ? workTime : breakTime,
            };
        }

        default:
            return state;
    }
};

export default pomodoroReducer;
