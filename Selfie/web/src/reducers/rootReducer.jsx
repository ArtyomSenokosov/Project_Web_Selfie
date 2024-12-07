import {combineReducers} from 'redux';
import authReducer from './authReducer';
import calendarReducer from './calendarReducer';
import uiReducer from './uiReducer';
import notesReducer from './notesReducer';
import tasksReducer from './tasksReducer';
import {notificationsReducer} from "./notificationsReducer";
import pomodoroReducer from "./pomodoroReducer";

const rootReducer = combineReducers({
    notes: notesReducer,
    auth: authReducer,
    calendar: calendarReducer,
    tasks: tasksReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
    pomodoro: pomodoroReducer,
});

export default rootReducer;
