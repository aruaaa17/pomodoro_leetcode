// frontend/src/TimeDial.jsx
import React, { useState, useEffect, useRef } from "react";

export default function TimeDial() {
    const radius = 150; 
    const circumference = 2 * Math.PI * radius;
    const center = 180;
    const strokeWidth = 18;
    const svgSize = 360;

    const svgRef = useRef(null);

    const [minutes, setMinutes] = useState(45);
    const [remaining, setRemaining] = useState(45 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const handlePointerMove = (e) => {
        if (!svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - center;
        const y = e.clientY - rect.top - center;
        const dist = Math.sqrt(x * x + y * y);

        if (
            dist < radius - strokeWidth / 2 ||
            dist > radius + strokeWidth / 2
        ) {
            // if the pointer is outside the circle, do nothing
            return;
        }

        const angle = Math.atan2(y, x);
        const normalized = (angle + Math.PI * 2) % (2 * Math.PI);
        const percent = normalized / (2 * Math.PI);
        const newMinutes = Math.round(percent * 60);

        setMinutes(newMinutes);
        setRemaining(newMinutes * 60);
    };

    const percentage = remaining / (minutes * 60 || 1);

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <svg
                ref={svgRef}
                width={svgSize}
                height={svgSize}
                onMouseDown={(e) => {
                    if (!isRunning) {
                        handlePointerMove(e);
                        window.addEventListener("mousemove", handlePointerMove);
                        window.addEventListener(
                            "mouseup",
                            () => {
                                window.removeEventListener("mousemove", handlePointerMove);
                            },
                            { once: true }
                        );
                    }
                }}
                style={{ cursor: isRunning ? "default" : "pointer" }}
            >
                {/* BG Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#eee"
                    strokeWidth="18"
                    fill="none"
                />
                {/* Progress Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#cce4ff"
                    strokeWidth="18"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - percentage)}
                    strokeLinecap="butt"
                    transform={`rotate(-90 ${center} ${center})`}
                    style={{ transition: "stroke-dashoffset 1s linear", cursor: isRunning ? "default" : "pointer" }}
                    onMouseDown={(e) => {
                        if (!isRunning) {
                            handlePointerMove(e);
                            window.addEventListener("mousemove", handlePointerMove);
                            window.addEventListener(
                                "mouseup",
                                () => {
                                    window.removeEventListener("mousemove", handlePointerMove);
                                },
                                { once: true }
                            );
                        }
                    }}
                />
                <text
                    x={center}
                    y={center + 12}
                    textAnchor="middle"
                    fontSize="36"
                    fontFamily="Arial"
                    fill="#333"
                    style={{ userSelect: "none" }}
                >
                    {Math.floor(remaining / 60)
                        .toString()
                        .padStart(2, "0")}
                    :
                    {(remaining % 60).toString().padStart(2, "0")}
                </text>
            </svg>

            <div style={{ marginTop: "2rem" }}>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    style={{ fontSize: "18px", padding: "10px 20px" }}
                >
                    {isRunning ? "暂停" : "开始"}
                </button>
                <button
                    onClick={() => {
                        setIsRunning(false);
                        setRemaining(minutes * 60);
                    }}
                    style={{ marginLeft: "1rem", fontSize: "18px", padding: "10px 20px" }}
                >
                    重置
                </button>
            </div>
        </div>
    );
}