import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Clock,
  CheckCircle,
  FileText,
  Home
} from 'lucide-react';
import { useAppContext, UserRole } from '../App';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { 
    currentUser, 
    setCurrentUser, 
    setCurrentPage,
    selectedDepartment,
    setSelectedDepartment,
    selectedShift,
    setSelectedShift
  } = useAppContext();

  const departments = ['CSE', 'IT', 'Mechanical', 'Civil', 'Electrical', 'ECE'];

  const getMenuItems = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'data-input', label: 'Data Input', icon: Settings },
          { id: 'generate', label: 'Generate Timetable', icon: Calendar },
          { id: 'manage', label: 'Manage Timetables', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'faculty':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'timetable', label: 'My Timetable', icon: Calendar },
          { id: 'requests', label: 'Change Requests', icon: Clock },
        ];
      case 'hod':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'pending', label: 'Pending Approvals', icon: Clock },
          { id: 'approved', label: 'Approved Timetables', icon: CheckCircle },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'timetable', label: 'Class Timetable', icon: Calendar },
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const menuItems = getMenuItems(currentUser?.role);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Smart Timetable</h1>
        </div>
        
        {/* User Info */}
        <div className="text-sm text-gray-600">
          <p className="font-medium">{currentUser?.name}</p>
          <p className="capitalize">{currentUser?.role}</p>
          {currentUser?.department && (
            <p className="text-xs">{currentUser.department} Department</p>
          )}
        </div>
      </div>

      {/* Department & Shift Selector (for applicable roles) */}
      {(currentUser?.role === 'admin' || currentUser?.role === 'hod') && (
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Department</label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Shift</label>
            <Select value={selectedShift} onValueChange={(value: 'morning' | 'evening') => setSelectedShift(value)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}