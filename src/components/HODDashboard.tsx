import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { HODOverview } from './hod/HODOverview';
import { PendingApprovals } from './hod/PendingApprovals';
import { ApprovedTimetables } from './hod/ApprovedTimetables';
import { AnalyticsDashboard } from './admin/AnalyticsDashboard';

export function HODDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HODOverview />;
      case 'pending':
        return <PendingApprovals />;
      case 'approved':
        return <ApprovedTimetables />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <HODOverview />;
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