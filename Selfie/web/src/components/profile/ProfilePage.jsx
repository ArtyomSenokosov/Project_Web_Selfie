import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateProfile} from '../../actions/auth';
import Navbar from '../ui/Navbar';
import './profile.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const {id, firstName, lastName, birthDate} = useSelector((state) => state.auth);

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        birthDate: ''
    });

    useEffect(() => {
        if (id) {
            setFormValues({
                firstName: firstName || '',
                lastName: lastName || '',
                birthDate: birthDate ? new Date(birthDate).toISOString().substring(0, 10) : ''
            });
        }
    }, [id, firstName, lastName, birthDate]);

    const handleInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(formValues));
    };

    return (
        <div className="profile-page-container">
            <Navbar/>
            <div className="form-page-container">
                <div className="form-container">
                    <h1 className="profile-title">Profile</h1>
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formValues.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formValues.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDate">Birth Date</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formValues.birthDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
