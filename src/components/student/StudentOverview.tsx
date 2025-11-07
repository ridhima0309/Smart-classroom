import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  MapPin,
  Bell,
  Download,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAppContext } from '../../App';

export function StudentOverview() {
  const { 
    currentUser,
    timetables, 
    subjects,
    batches
  } = useAppContext();

  const studentBatch = batches.find(b => 
    b.department === currentUser?.department && 
    currentUser?.name.includes(b.name.split('-')[0]) // Simple batch matching logic
  );

  const approvedTimetables = timetables.filter(t => 
    t.status === 'approved' && 
    t.department === currentUser?.department
  );

  // Get today's schedule
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses: any[] = [];
  const upcomingClasses: any[] = [];

  approvedTimetables.forEach(timetable => {
    const todaySlots = timetable.slots.filter(slot => 
      slot.day === today && 
      slot.batch === studentBatch?.name &&
      slot.type !== 'break'
    );
    todayClasses.push(...todaySlots);
  });

  const currentTime = new Date();
  const currentTimeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

  // Filter upcoming classes (classes that haven't started yet today)
  todayClasses.forEach(classSlot => {
    if (classSlot.startTime > currentTimeString) {
      upcomingClasses.push(classSlot);
    }
  });

  // Sort upcoming classes by time
  upcomingClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Get all subjects for the student's batch
  const batchSubjects = subjects.filter(s => s.department === currentUser?.department);

  // Calculate weekly stats
  let totalWeeklyClasses = 0;
  let totalWeeklyHours = 0;

  approvedTimetables.forEach(timetable => {
    const batchSlots = timetable.slots.filter(slot => 
      slot.batch === studentBatch?.name && slot.type !== 'break'
    );
    totalWeeklyClasses += batchSlots.length;
    totalWeeklyHours += batchSlots.reduce((sum, slot) => sum + (slot.duration / 60), 0);
  });

  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'New timetable has been approved and is now active',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Room change: Data Structures class moved to Lab A2',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Mid-semester exam schedule has been released',
      time: '2 days ago'
    }
  ];

  const handleDownloadTimetable = () => {
    // Mock download functionality
    console.log('Downloading timetable for', studentBatch?.name);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name}</h1>
          <p className="text-gray-600">
            {currentUser?.department} Department • {studentBatch?.name || 'Student'}
          </p>
        </div>
        <Button onClick={handleDownloadTimetable}>
          <Download className="h-4 w-4 mr-2" />
          Download Timetable
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Classes</p>
                <p className="text-2xl font-bold text-gray-900">{todayClasses.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Weekly Classes</p>
                <p className="text-2xl font-bold text-gray-900">{totalWeeklyClasses}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalWeeklyHours)}h</p>
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
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-900">{batchSubjects.length}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <BookOpen className="h-6 w-6 text-orange-600" />
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
              Today's Classes ({today})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayClasses.length > 0 ? (
                todayClasses.map((classSlot, index) => {
                  const isUpcoming = classSlot.startTime > currentTimeString;
                  const isPast = classSlot.endTime < currentTimeString;
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border ${
                        isUpcoming ? 'bg-blue-50 border-blue-200' :
                        isPast ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{classSlot.subject}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{classSlot.type}</Badge>
                          {isUpcoming && <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>}
                          {isPast && <Badge variant="secondary">Completed</Badge>}
                          {!isUpcoming && !isPast && <Badge className="bg-green-100 text-green-800">Ongoing</Badge>}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {classSlot.startTime} - {classSlot.endTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {classSlot.classroom}
                        </div>
                        <div className="text-xs">
                          Faculty: {classSlot.faculty}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No classes scheduled for today</p>
                  <p className="text-sm">Enjoy your free day!</p>
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
              {batchSubjects.length > 0 ? (
                batchSubjects.slice(0, 6).map((subject) => (
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
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No subjects available</p>
              )}
              {batchSubjects.length > 6 && (
                <p className="text-sm text-gray-500 text-center">
                  +{batchSubjects.length - 6} more subjects
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Class Alert */}
      {upcomingClasses.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Next Class</h3>
                <p className="text-blue-800">
                  {upcomingClasses[0].subject} at {upcomingClasses[0].startTime} in {upcomingClasses[0].classroom}
                </p>
                <p className="text-sm text-blue-600">Faculty: {upcomingClasses[0].faculty}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {upcomingClasses[0].type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Batch Information */}
      {studentBatch && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">{studentBatch.name}</p>
                <p className="text-sm text-gray-600">Batch Name</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">{studentBatch.level}</p>
                <p className="text-sm text-gray-600">Level</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">{studentBatch.strength}</p>
                <p className="text-sm text-gray-600">Batch Strength</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold capitalize">{studentBatch.shift}</p>
                <p className="text-sm text-gray-600">Shift</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}