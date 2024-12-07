export const pomodoroTypes = {
    START_TIMER: "START_TIMER",
    PAUSE_TIMER: "PAUSE_TIMER",
    RESET_TIMER: "RESET_TIMER",
    SWITCH_PHASE: "SWITCH_PHASE",
    REDUCE_TIME: "REDUCE_TIME",
    UPDATE_SETTINGS: "UPDATE_SETTINGS",
    RESTORE_STATE: "RESTORE_STATE",
    UPDATE_LAST_UPDATED: "UPDATE_LAST_UPDATED",
    END_CURRENT_CYCLE: "END_CURRENT_CYCLE",
    CALCULATE_TIME: "CALCULATE_TIME",
};

export const startTimer = () => ({
    type: pomodoroTypes.START_TIMER,
});

export const pauseTimer = () => ({
    type: pomodoroTypes.PAUSE_TIMER,
});

export const resetTimer = () => ({
    type: pomodoroTypes.RESET_TIMER,
});

export const switchPhase = () => ({
    type: pomodoroTypes.SWITCH_PHASE,
});

export const updateSettings = (settings) => ({
    type: pomodoroTypes.UPDATE_SETTINGS,
    payload: settings,
});

export const restoreState = (savedState) => ({
    type: pomodoroTypes.RESTORE_STATE,
    payload: savedState,
});

export const updateLastUpdated = (timestamp) => ({
    type: pomodoroTypes.UPDATE_LAST_UPDATED,
    payload: timestamp,
});

export const endCurrentCycle = () => ({
    type: pomodoroTypes.END_CURRENT_CYCLE,
});

export const calculateTime = (totalTime, workPercentage) => ({
    type: pomodoroTypes.CALCULATE_TIME,
    payload: {totalTime, workPercentage},
});
