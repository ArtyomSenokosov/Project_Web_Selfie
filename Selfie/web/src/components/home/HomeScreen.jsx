import React from 'react';
import {Link} from 'react-router-dom';
import Navbar from '../ui/Navbar';
import './home.css';
import '../ui/ui.css';

const HomeScreen = () => {
    return (
        <div className="page-container">
            <Navbar/>
            <div className="widgets-container">
                <Link to="/calendar" className="widget-box">
                    <div className="widget-title" style={{textAlign: 'center'}}>Calendar</div>
                </Link>
                <Link to="/notes" className="widget-box">
                    <div className="widget-title" style={{textAlign: 'center'}}>Notes</div>
                </Link>
                <Link to="/pomodoro" className="widget-box">
                    <div className="widget-title" style={{textAlign: 'center'}}>Pomodoro</div>
                </Link>
            </div>
        </div>
    );
};

export default HomeScreen;
