import React, { useState, useEffect, useRef } from 'react';

function PomodoroTimer({ initialMinutes = 25 }) {
    const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
    const intervalRef = useRef(null);

    const startTimer = () => {
        if (intervalRef.current !== null) return; // 避免重复启动
        intervalRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev === 0) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const pauseTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetTimer = () => {
        pauseTimer();
        setSecondsLeft(initialMinutes * 60);
    };

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return (
        <div>
            <h2>番茄钟</h2>
            <div>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
            <button onClick={startTimer}>开始</button>
            <button onClick={pauseTimer}>暂停</button>
            <button onClick={resetTimer}>重置</button>
        </div>
    );
}

export default PomodoroTimer;
