import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SideBar from './components/Sidebar/Sidebar';
import Tabs from './components/Tabs/Tabs';

const App: React.FC= () => {
  return (
    <Router>
      <div className="app-container">
        <SideBar />
        <Tabs />
      </div>
    </Router>
  );
}

export default App;
