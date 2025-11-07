import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { DataInputForms } from './admin/DataInputForms';
import { TimetableGeneration } from './admin/TimetableGeneration';
import { TimetableManagement } from './admin/TimetableManagement';
import { AnalyticsDashboard } from './admin/AnalyticsDashboard';
import { AdminOverview } from './admin/AdminOverview';
import { supabase } from '../supabaseClient'; // ✅ adjust path if needed

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ✅ Supabase connection test
  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase.from('faculty').select('*').limit(1);
      if (error) {
        console.error('❌ Supabase connection failed:', error.message);
      } else {
        console.log('✅ Supabase connected! Sample data:', data);
      }
    }
    checkConnection();
  }, []);

  // ✅ Render different admin components
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminOverview />;
      case 'data-input':
        return <DataInputForms />;
      case 'generate':
        return <TimetableGeneration />;
      case 'manage':
        return <TimetableManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
