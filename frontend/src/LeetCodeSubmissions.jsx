// frontend/src/LeetCodeSubmissions.jsx
import React, { useState } from "react";

export default function LeetCodeSubmissions() {
    const [username, setUsername] = useState("");
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState(null);

    const fetchSubmissions = async () => {
        setError(null);
        try {
            const res = await fetch(`http://127.0.0.1:5000/leetcode-submissions?username=${username}`);
            if (!res.ok) {
                const errData = await res.json();
                setError(errData.error || "Unknown error");
                setSubmissions([]);
                return;
            }
            const data = await res.json();
            setSubmissions(data.today_submissions);
        } catch (err) {
            setError("Failed to fetch");
            setSubmissions([]);
        }
    };

    return (
        <div>
            <h2>LeetCode 今日提交查询</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入 LeetCode 用户名"
            />
            <button onClick={fetchSubmissions}>查询</button>

            {error && <p style={{ color: "red" }}>错误：{error}</p>}

            <ul>
                {submissions.map((sub) => (
                    <li key={sub.timestamp}>
                        题目：{sub.title} — 语言：{sub.lang} — 状态：{sub.statusDisplay}
                    </li>
                ))}
            </ul>
        </div>
    );
}
