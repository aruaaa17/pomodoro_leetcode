// frontend/src/App.js
import React from 'react';
import PomodoroTimer from './PomodoroTimer';

import TimeDial from './TimeDial';
import LeetCodeSubmissions from './LeetCodeSubmissions';

function App() {
  return (
    <div style={{ padding: 20 }}>
      {/* <PomodoroTimer /> */}
      <TimeDial />
      <hr />
      <LeetCodeSubmissions />
    </div>
  );
}

export default App;
