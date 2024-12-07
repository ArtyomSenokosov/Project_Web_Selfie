import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {toast, ToastContainer} from "react-toastify";
import {removeNotification} from "../../reducers/notificationsReducer";
import "react-toastify/dist/ReactToastify.css";

const GlobalNotifications = () => {
    const notifications = useSelector((state) => state.notifications.notifications);
    const dispatch = useDispatch();

    useEffect(() => {
        notifications.forEach((notification) => {
            if (!toast.isActive(notification.id)) {
                toast(notification.message, {
                    type: notification.type,
                    toastId: notification.id,
                    onClose: () => dispatch(removeNotification(notification.id)),
                });
            }
        });
    }, [notifications, dispatch]);

    return <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover/>;
};

export default GlobalNotifications;
