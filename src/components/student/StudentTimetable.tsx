import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Calendar, 
  Download, 
  Clock,
  MapPin,
  User,
  BookOpen,
  Smartphone
} from 'lucide-react';
import { useAppContext } from '../../App';
import { toast } from 'sonner';

export function StudentTimetable() {
  const { currentUser, timetables, batches } = useAppContext();
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const studentBatch = batches.find(b => 
    b.department === currentUser?.department && 
    currentUser?.name.includes(b.name.split('-')[0]) // Simple batch matching logic
  );

  const approvedTimetables = timetables.filter(t => 
    t.status === 'approved' && 
    t.department === currentUser?.department
  );

  // Get student's timetable
  const studentSchedule: { [key: string]: any[] } = {};
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  days.forEach(day => {
    studentSchedule[day] = [];
  });

  approvedTimetables.forEach(timetable => {
    const batchSlots = timetable.slots.filter(slot => 
      studentBatch && (slot.batch === studentBatch.name || slot.type === 'break')
    );
    
    batchSlots.forEach(slot => {
      if (studentSchedule[slot.day]) {
        studentSchedule[slot.day].push({
          ...slot,
          shift: timetable.shift
        });
      }
    });
  });

  // Sort slots by time for each day
  Object.keys(studentSchedule).forEach(day => {
    studentSchedule[day].sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
  });

  const handleDownloadTimetable = () => {
    toast.success('Timetable downloaded successfully');
  };

  const handleShareTimetable = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Class Timetable',
        text: `${studentBatch?.name} Timetable - ${currentUser?.department} Department`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Timetable link copied to clipboard');
    }
  };

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'break':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'lab':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'lecture':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const totalClasses = Object.values(studentSchedule).flat().filter(slot => slot.type !== 'break').length;
  const totalHours = Object.values(studentSchedule).flat()
    .filter(slot => slot.type !== 'break')
    .reduce((sum, slot) => sum + (slot.duration / 60), 0);

  const getNextClass = () => {
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const todayClasses = studentSchedule[today]?.filter(slot => 
      slot.type !== 'break' && slot.startTime > currentTime
    );
    
    return todayClasses && todayClasses.length > 0 ? todayClasses[0] : null;
  };

  const nextClass = getNextClass();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
          <p className="text-gray-600">
            {studentBatch?.name} • {currentUser?.department} Department
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Week</SelectItem>
              <SelectItem value="next">Next Week</SelectItem>
              <SelectItem value="previous">Previous Week</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleShareTimetable}>
            <Smartphone className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleDownloadTimetable}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalHours)}h</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(studentSchedule).filter(slots => 
                    slots.some(slot => slot.type !== 'break')
                  ).length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shift</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {studentBatch?.shift || 'N/A'}
                </p>
              </div>
              <User className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Class Alert */}
      {nextClass && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Next Class</h3>
                <p className="text-blue-800">
                  {nextClass.subject} at {nextClass.startTime} in {nextClass.classroom}
                </p>
                <p className="text-sm text-blue-600">Faculty: {nextClass.faculty}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {nextClass.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Weekly Schedule</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
        </div>
      </div>

      {/* Timetable Display */}
      {viewMode === 'grid' ? (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {days.map(day => (
                <div key={day} className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                    {day}
                  </h3>
                  <div className="space-y-2">
                    {studentSchedule[day].length > 0 ? (
                      studentSchedule[day].map((slot, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg border ${getSlotColor(slot.type)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{slot.subject}</span>
                            <Badge variant="outline" className="text-xs">
                              {slot.type}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {slot.startTime} - {slot.endTime}
                            </div>
                            {slot.type !== 'break' && (
                              <>
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {slot.classroom}
                                </div>
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {slot.faculty}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No classes</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule - List View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {days.map(day => (
                <div key={day}>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 border-b pb-2">
                    {day}
                  </h3>
                  {studentSchedule[day].length > 0 ? (
                    <div className="space-y-2">
                      {studentSchedule[day].filter(slot => slot.type !== 'break').map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="font-medium">{slot.subject}</h4>
                              <Badge variant="outline">{slot.type}</Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {slot.startTime} - {slot.endTime}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {slot.classroom}
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {slot.faculty}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic py-4">No classes scheduled</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded mr-2"></div>
              <span>Lecture</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded mr-2"></div>
              <span>Lab</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
              <span>Break</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}