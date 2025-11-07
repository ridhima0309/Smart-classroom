import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Bell
} from 'lucide-react';
import { useAppContext } from '../../App';

export function FacultyOverview() {
  const { 
    currentUser,
    timetables, 
    subjects,
    faculties
  } = useAppContext();

  const faculty = faculties.find(f => f.name === currentUser?.name);
  const approvedTimetables = timetables.filter(t => 
    t.status === 'approved' && 
    t.department === currentUser?.department
  );

  // Calculate faculty's weekly schedule
  let totalWeeklyHours = 0;
  let todayClasses = 0;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  approvedTimetables.forEach(timetable => {
    const facultySlots = timetable.slots.filter(slot => 
      slot.faculty === currentUser?.name && slot.type !== 'break'
    );
    
    totalWeeklyHours += facultySlots.reduce((sum, slot) => sum + (slot.duration / 60), 0);
    todayClasses += facultySlots.filter(slot => slot.day === today).length;
  });

  const facultySubjects = subjects.filter(s => 
    faculty?.subjects.includes(s.id) && s.department === currentUser?.department
  );

  const upcomingClasses = [];
  const currentTime = new Date();
  const currentTimeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

  approvedTimetables.forEach(timetable => {
    const todaySlots = timetable.slots.filter(slot => 
      slot.faculty === currentUser?.name && 
      slot.day === today && 
      slot.type !== 'break' &&
      slot.startTime > currentTimeString
    );
    upcomingClasses.push(...todaySlots.slice(0, 3)); // Next 3 classes
  });

  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'Your timetable for next week has been approved',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Room change: CS101 moved to Room 205 for tomorrow',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Your leave request has been approved',
      time: '2 days ago'
    }
  ];

  const maxWeeklyHours = 20; // Typical faculty load
  const workloadPercentage = (totalWeeklyHours / maxWeeklyHours) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name}</h1>
        <p className="text-gray-600">
          {currentUser?.department} Department Faculty Dashboard
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Classes</p>
                <p className="text-2xl font-bold text-gray-900">{todayClasses}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalWeeklyHours}h</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={workloadPercentage} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects Teaching</p>
                <p className="text-2xl font-bold text-gray-900">{facultySubjects.length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-sm font-bold text-green-600">
                  {faculty?.isOnLeave ? 'On Leave' : 'Available'}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                {faculty?.isOnLeave ? (
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule and Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Schedule ({today})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">{slot.subject}</p>
                      <p className="text-sm text-gray-600">{slot.batch} • {slot.classroom}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{slot.startTime}</p>
                      <Badge variant="outline">{slot.type}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No more classes today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Your Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facultySubjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-gray-600">{subject.code}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{subject.type}</Badge>
                    <Badge variant="secondary">{subject.weeklyHours}h/week</Badge>
                  </div>
                </div>
              ))}
              {facultySubjects.length === 0 && (
                <p className="text-gray-500 text-center py-4">No subjects assigned</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-1 rounded-full ${
                  notification.type === 'info' ? 'bg-blue-100' :
                  notification.type === 'warning' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  {notification.type === 'info' ? (
                    <Bell className={`h-3 w-3 text-blue-600`} />
                  ) : notification.type === 'warning' ? (
                    <AlertTriangle className={`h-3 w-3 text-yellow-600`} />
                  ) : (
                    <CheckCircle className={`h-3 w-3 text-green-600`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workload Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Weekly Workload Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Teaching Hours</span>
              <span className="font-medium">{totalWeeklyHours}h / {maxWeeklyHours}h</span>
            </div>
            <Progress value={workloadPercentage} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="font-medium">{facultySubjects.length}</p>
                <p className="text-gray-600">Subjects</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{Math.round(totalWeeklyHours)}</p>
                <p className="text-gray-600">Hours/Week</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{faculty?.availability.length || 0}</p>
                <p className="text-gray-600">Available Days</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{faculty?.avgLeavesPerMonth || 0}</p>
                <p className="text-gray-600">Avg Leaves/Month</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}