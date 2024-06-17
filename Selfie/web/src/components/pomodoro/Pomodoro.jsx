import React, {Component} from 'react';
import TypeSelect from '../ui/pomodoro/TypeSelect';
import TimeDisplay from '../ui/pomodoro/TimeDisplay';
import Controls from '../ui/pomodoro/Controls';
import Shortcuts from '../ui/pomodoro/Shortcuts';
import ToggleTask from '../ui/pomodoro/Tasks/TaskToggle';
import TaskList from '../ui/pomodoro/Tasks/TaskList';
import './Pomodoro.css';
import Navbar from '../ui/Navbar';

class Pomodoro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedType: props.types[0],
            time: props.types[0].time,
            interval: null,
            running: false,
            taskStatus: JSON.parse(window.localStorage.getItem('pomodoro-react-taskStatus')) || null
        };
    }

    static defaultProps = {
        types: [
            {name: 'Pomodoro', time: 1500},
            {name: 'Short Break', time: 300},
            {name: 'Long Break', time: 900}
        ]
    };

    componentDidMount() {
        document.addEventListener('keyup', this.handleKeyUp);
        Notification.requestPermission();
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.handleKeyUp);
        this.stopInterval();
    }

    handleKeyUp = (event) => {
        if (event.target.tagName === 'INPUT') return;
        if (event.key === ' ') {
            this.pauseTimer();
        } else if (event.key === 'Escape') {
            this.resetTimer();
        } else if (event.key >= 1 && event.key <= this.props.types.length) {
            this.changeType(this.props.types[event.key - 1]);
        }
    };

    changeType = (type) => {
        this.resetTimer();
        this.setState({selectedType: type, time: type.time, running: false});
    };

    tick = () => {
        if (this.state.time <= 1) {
            this.stopInterval();
            this.setState({running: false});
            this.showNotification(`${this.state.selectedType.name} finished!`);
        } else {
            this.setState(state => ({time: state.time - 1}));
        }
    };

    stopInterval = () => {
        clearInterval(this.state.interval);
        this.setState({interval: null});
    };

    startTimer = () => {
        this.setState(state => ({
            running: true,
            interval: setInterval(this.tick, 1000),
            time: state.time > 0 ? state.time : state.selectedType.time
        }));
    };

    resetTimer = () => {
        this.stopInterval();
        this.setState(state => ({
            time: state.selectedType.time,
            running: false
        }));
    };

    pauseTimer = () => {
        this.state.interval ? this.stopInterval() : this.startTimer();
    };

    showNotification = (message) => {
        if (Notification.permission === 'granted') {
            new Notification(message);
        }
    };

    getStatus = () => {
        const {time, running, interval} = this.state;
        if (time === 0) return 'Finished';
        if (running && !interval) return 'Paused';
        if (running) return 'Running';
    };

    getProgress = () => {
        const current = this.state.time;
        const total = this.state.selectedType.time;
        return ((total - current) / total) * 100;
    };

    handleToggleTask = () => {
        this.setState(
            state => ({
                taskStatus: !state.taskStatus
            }),
            () => {
                window.localStorage.setItem('pomodoro-react-taskStatus', this.state.taskStatus);
            }
        );
    };

    render() {
        const {time, selectedType, taskStatus} = this.state;
        const {types} = this.props;

        return (
            <div className="pomodoro-app">
                <Navbar/>
                <div className="pomodoro-container"> {}
                    <div className="Pomodoro">
                        <TypeSelect types={types} selected={selectedType} changeType={this.changeType}/>
                        <TimeDisplay time={time} status={this.getStatus()} progress={this.getProgress()}/>
                        <Controls start={this.startTimer} reset={this.resetTimer} pause={this.pauseTimer}
                                  status={this.getStatus()}/>
                        <ToggleTask task={taskStatus} toggleTask={this.handleToggleTask}/>
                        <Shortcuts/>
                    </div>
                    {taskStatus && (
                        <div className="TaskPanel">
                            <TaskList/>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Pomodoro;
