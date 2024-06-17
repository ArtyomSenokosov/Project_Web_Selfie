import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AuthRouter from "./AuthRouter";
import CalendarScreen from "../components/calendar/CalendarScreen";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {startChecking} from "../actions/auth";
import LoadingScreen from "../components/ui/LoadingScreen";

import HomePage from '../components/home/HomeScreen';
import Pomodoro from '../components/pomodoro/Pomodoro.jsx';
import Profile from '../components/profile/ProfilePage.jsx';
import {AddNotePage} from '../components/note/AddNotePage';
import {NotesListPage} from '../components/note/NotesListPage';
import {EditNotePage} from '../components/note/EditNotePage';

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
                    path="/notes/add"
                    element={
                        <PrivateRoute isAuth={!!id}>
                            <AddNotePage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notes/edit/:id"
                    element={
                        <PrivateRoute isAuth={!!id}>
                            <EditNotePage/>
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
            </Routes>
        </Router>
    );
};

export default AppRouter;
