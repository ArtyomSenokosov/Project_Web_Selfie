import {useDispatch, useSelector} from "react-redux";
import Swal from "sweetalert2";
import {eventStartDelete} from "../../actions/event";
import {startDeletingTask, tasksClearActive} from "../../actions/tasks";
import DeleteIcon from "./icons/DeleteIcon";

const DeleteBtn = () => {
    const dispatch = useDispatch();
    const {activeEvent} = useSelector((state) => state.calendar);
    const {activeTask} = useSelector((state) => state.tasks);

    const handleClickDelete = () => {
        if (activeTask) {
            Swal.fire({
                title: "Delete task",
                text: "Do you want to delete the selected task?",
                icon: "warning",
                confirmButtonText: "Yes, delete!",
                showCancelButton: true,
            }).then(({isConfirmed}) => {
                if (isConfirmed) {
                    dispatch(startDeletingTask(activeTask._id));
                    dispatch(tasksClearActive());
                }
            });
        } else if (activeEvent) {
            Swal.fire({
                title: "Delete event",
                text: "Do you want to delete the selected event?",
                icon: "warning",
                confirmButtonText: "Yes, delete!",
                showCancelButton: true,
            }).then(({isConfirmed}) => {
                if (isConfirmed) {
                    dispatch(eventStartDelete());
                }
            });
        } else {
            Swal.fire("Error", "No task or event selected to delete.", "error");
        }
    };

    return (
        <button
            className="btn btn-primary btn--floating btn--floating-left"
            onClick={handleClickDelete}
        >
            <DeleteIcon/>
        </button>
    );
};

export default DeleteBtn;
