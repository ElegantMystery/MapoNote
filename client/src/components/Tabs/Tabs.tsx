import React from 'react';
import './Tabs.css';
import { Routes, Route } from 'react-router-dom';
import HomeTab from './HomeTab';
import Notes from '../Notes/NotesContainer';

const Tabs: React.FC = () => {
  return (
    <div className="tabs">
      <Routes>
        <Route path="/" element={<HomeTab />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </div>
  );
}

export default Tabs;
