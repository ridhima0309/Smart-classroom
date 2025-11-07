import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  BookOpen,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useAppContext } from '../../App';

export function HODOverview() {
  const { 
    currentUser,
    timetables, 
    subjects,
    faculties,
    batches,
    selectedDepartment, 
    selectedShift 
  } = useAppContext();

  const pendingTimetables = timetables.filter(t => 
    t.status === 'pending' && 
    t.department === selectedDepartment && 
    t.shift === selectedShift
  );

  const approvedTimetables = timetables.filter(t => 
    t.status === 'approved' && 
    t.department === selectedDepartment && 
    t.shift === selectedShift
  );

  const rejectedTimetables = timetables.filter(t => 
    t.status === 'rejected' && 
    t.department === selectedDepartment && 
    t.shift === selectedShift
  );

  const departmentStats = {
    subjects: subjects.filter(s => s.department === selectedDepartment).length,
    faculties: faculties.filter(f => f.department === selectedDepartment).length,
    batches: batches.filter(b => b.department === selectedDepartment && b.shift === selectedShift).length,
    facultiesOnLeave: faculties.filter(f => f.department === selectedDepartment && f.isOnLeave).length
  };

  const recentActivity = [
    {
      id: 1,
      type: 'approval_request',
      message: 'New timetable submitted for approval',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'faculty_leave',
      message: 'Dr. Smith submitted leave request',
      time: '4 hours ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'timetable_approved',
      message: 'CSE Morning Timetable v2 approved',
      time: '1 day ago',
      priority: 'low'
    }
  ];

  const urgentTasks = [
    {
      id: 1,
      task: 'Review pending timetable approvals',
      count: pendingTimetables.length,
      priority: 'high'
    },
    {
      id: 2,
      task: 'Address faculty leave conflicts',
      count: departmentStats.facultiesOnLeave,
      priority: departmentStats.facultiesOnLeave > 0 ? 'high' : 'low'
    },
    {
      id: 3,
      task: 'Review change requests',
      count: 3,
      priority: 'medium'
    }
  ];

  const approvalRate = timetables.length > 0 
    ? (approvedTimetables.length / timetables.filter(t => t.department === selectedDepartment).length) * 100 
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HOD Dashboard</h1>
        <p className="text-gray-600">
          {selectedDepartment} Department Overview - {selectedShift} Shift
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{pendingTimetables.length}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Timetables</p>
                <p className="text-2xl font-bold text-gray-900">{approvedTimetables.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Faculty Availability</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departmentStats.faculties - departmentStats.facultiesOnLeave}/{departmentStats.faculties}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(approvalRate)}%</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview and Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Department Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Subjects</span>
              <Badge variant="secondary">{departmentStats.subjects}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Faculty</span>
              <Badge variant="secondary">{departmentStats.faculties}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Batches</span>
              <Badge variant="secondary">{departmentStats.batches}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Faculty on Leave</span>
              <Badge variant={departmentStats.facultiesOnLeave > 0 ? "destructive" : "default"}>
                {departmentStats.facultiesOnLeave}
              </Badge>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Faculty Availability</span>
                <span>
                  {departmentStats.faculties > 0 
                    ? Math.round(((departmentStats.faculties - departmentStats.facultiesOnLeave) / departmentStats.faculties) * 100)
                    : 100}%
                </span>
              </div>
              <Progress 
                value={departmentStats.faculties > 0 
                  ? ((departmentStats.faculties - departmentStats.facultiesOnLeave) / departmentStats.faculties) * 100
                  : 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Urgent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium">{task.task}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={task.count > 0 ? "default" : "secondary"}>
                    {task.count}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Timetable Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timetable Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Timetable Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timetables.filter(t => t.department === selectedDepartment).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No timetables found</p>
                <p className="text-sm text-gray-400">Generate timetables using the admin panel first</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">Pending Approval</span>
                  </div>
                  <Badge variant="secondary">{pendingTimetables.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Approved</span>
                  </div>
                  <Badge>{approvedTimetables.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm">Rejected</span>
                  </div>
                  <Badge variant="destructive">{rejectedTimetables.length}</Badge>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Overall Approval Rate</span>
                    <span>{Math.round(approvalRate)}%</span>
                  </div>
                  <Progress value={approvalRate} className="h-2" />
                </div>
              </>
            )}            
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${
                    activity.priority === 'high' ? 'bg-red-100' :
                    activity.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    {activity.type === 'approval_request' ? (
                      <Clock className={`h-3 w-3 ${
                        activity.priority === 'high' ? 'text-red-600' :
                        activity.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    ) : activity.type === 'faculty_leave' ? (
                      <AlertTriangle className={`h-3 w-3 ${
                        activity.priority === 'high' ? 'text-red-600' :
                        activity.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    ) : (
                      <CheckCircle className={`h-3 w-3 ${
                        activity.priority === 'high' ? 'text-red-600' :
                        activity.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="text-left">
                <p className="font-medium">Review Pending Approvals</p>
                <p className="text-sm text-gray-600">{pendingTimetables.length} timetables waiting</p>
              </div>
            </Button>
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="text-left">
                <p className="font-medium">Faculty Management</p>
                <p className="text-sm text-gray-600">Manage leave requests & assignments</p>
              </div>
            </Button>
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="text-left">
                <p className="font-medium">Department Analytics</p>
                <p className="text-sm text-gray-600">View performance insights</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}