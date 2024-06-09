import React, { useState } from 'react';
import './App.css';
import BarChart from './components/BarChart';

function App() {
  const initialData = [12, 5, 6, 7, 10, 9];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Interactive Data Visualization Dashboard</h1>
        <BarChart initialData={initialData} />
      </header>
    </div>
  );
}

export default App;
