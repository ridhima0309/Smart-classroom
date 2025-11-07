import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { StudentOverview } from './student/StudentOverview';
import { StudentTimetable } from './student/StudentTimetable';

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentOverview />;
      case 'timetable':
        return <StudentTimetable />;
      default:
        return <StudentOverview />;
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