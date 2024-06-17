import {combineReducers} from 'redux';
import authReducer from './authReducer';
import calendarReducer from './calendarReducer';
import uiReducer from './uiReducer';
import notesReducer from './notesReducer';

const rootReducer = combineReducers({
    notes: notesReducer,
    auth: authReducer,
    calendar: calendarReducer,
    ui: uiReducer
});

export default rootReducer;
