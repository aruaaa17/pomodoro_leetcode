// frontend/src/App.js
import React from 'react';
import PomodoroTimer from './PomodoroTimer';
import LeetCodeSubmissions from './LeetCodeSubmissions';

function App() {
  return (
    <div style={{ padding: 20 }}>
      <PomodoroTimer />
      <hr />
      <LeetCodeSubmissions />
    </div>
  );
}

export default App;
