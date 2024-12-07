import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AuthRouter from "./AuthRouter";
import CalendarScreen from "../components/calendar/CalendarScreen";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {startChecking} from "../actions/auth";
import LoadingScreen from "../components/ui/LoadingScreen";
import GlobalNotifications from "../components/ui/GlobalNotifications";

import HomePage from '../components/home/HomeScreen';
import Pomodoro from '../components/pomodoro/Pomodoro.jsx';
import Profile from '../components/profile/ProfilePage.jsx';
import {NotesListPage} from '../components/note/NotesListPage';
import TasksListPage from "../components/tasks/TasksListPage";

const AppRouter = () => {
    const dispatch = useDispatch();
    const {checking, id} = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(startChecking());
    }, [dispatch]);


    if (checking) {
        return <LoadingScreen/>
    }

    return (
        <Router>
            <GlobalNotifications/>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <PublicRoute isAuth={!!id}>
                            <AuthRouter/>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <PrivateRoute isAuth={!!id}>
                            <HomePage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/calendar"
                    element={
                        <PrivateRoute isAuth={!!id}>
                            <CalendarScreen/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notes"
                    element={
                        <PrivateRoute isAuth={!!id}>
                            <NotesListPage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/pomodoro"
                    element={
                        <PrivateRoute isAuth={!!id}>
                            <Pomodoro/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute isAuth={!!id}>
                            <Profile/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute isAuth={!!id}>
                            <TasksListPage/>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;
