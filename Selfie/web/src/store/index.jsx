import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "../reducers/rootReducer";
import {pomodoroMiddleware} from "../reducers/pomodoroMiddleware";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(pomodoroMiddleware),
});

export default store;
