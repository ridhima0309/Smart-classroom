import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { FacultyOverview } from './faculty/FacultyOverview';
import { FacultyTimetable } from './faculty/FacultyTimetable';
import { ChangeRequests } from './faculty/ChangeRequests';

export function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <FacultyOverview />;
      case 'timetable':
        return <FacultyTimetable />;
      case 'requests':
        return <ChangeRequests />;
      default:
        return <FacultyOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}