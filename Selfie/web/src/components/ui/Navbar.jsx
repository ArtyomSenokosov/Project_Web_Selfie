import {useDispatch, useSelector} from "react-redux";
import {startLogout} from "../../actions/auth";
import LogoutIcon from "./icons/LogoutIcon";
import UserIcon from "./icons/UserIcon";
import "./ui.css";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const dispatch = useDispatch();
    const {name} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(startLogout());
    };

    const handleUserIconClick = () => {
        navigate("/");
    };

    const handleNameClick = () => {
        navigate("/profile");
    };

    return (
        <nav className="navbar">
            <ul className="navbar__list">
                <div className="navbar__item">
                    <UserIcon
                        className="navbar__link navbar__logo"
                        title="User Profile"
                        onClick={handleUserIconClick}
                    />
                    <span
                        className="navbar__link navbar__profile-name"
                        title="Profile Name"
                        onClick={handleNameClick}
                    >
                        {name}
                    </span>
                </div>
                <div className="navbar__item">
                    <LogoutIcon
                        className="navbar__link"
                        title="Logout"
                        onClick={handleLogout}
                    />
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
