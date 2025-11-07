import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Calendar, 
  Download, 
  Filter,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { useAppContext } from '../../App';
import { toast } from 'sonner';

export function FacultyTimetable() {
  const { currentUser, timetables } = useAppContext();
  const [selectedWeek, setSelectedWeek] = useState('current');

  const approvedTimetables = timetables.filter(t => 
    t.status === 'approved' && 
    t.department === currentUser?.department
  );

  // Get faculty's personal timetable
  const facultySchedule: { [key: string]: any[] } = {};
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  days.forEach(day => {
    facultySchedule[day] = [];
  });

  approvedTimetables.forEach(timetable => {
    const facultySlots = timetable.slots.filter(slot => 
      slot.faculty === currentUser?.name
    );
    
    facultySlots.forEach(slot => {
      if (facultySchedule[slot.day]) {
        facultySchedule[slot.day].push({
          ...slot,
          timetableName: timetable.name
        });
      }
    });
  });

  // Sort slots by time for each day
  Object.keys(facultySchedule).forEach(day => {
    facultySchedule[day].sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
  });

  const handleExportTimetable = () => {
    // Mock export functionality
    toast.success('Personal timetable exported successfully');
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

  const totalClasses = Object.values(facultySchedule).flat().filter(slot => slot.type !== 'break').length;
  const totalHours = Object.values(facultySchedule).flat()
    .filter(slot => slot.type !== 'break')
    .reduce((sum, slot) => sum + (slot.duration / 60), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
          <p className="text-gray-600">Personal teaching schedule</p>
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
          <Button onClick={handleExportTimetable}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {Object.values(facultySchedule).filter(slots => 
                    slots.some(slot => slot.type !== 'break')
                  ).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Timetable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map(day => (
              <div key={day} className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
                  {day}
                </h3>
                <div className="space-y-2">
                  {facultySchedule[day].length > 0 ? (
                    facultySchedule[day].map((slot, index) => (
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
                                <Users className="h-3 w-3 mr-1" />
                                {slot.batch}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No classes scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Schedule Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">Day</th>
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-left p-3 font-medium">Batch</th>
                  <th className="text-left p-3 font-medium">Classroom</th>
                  <th className="text-left p-3 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(facultySchedule).map(([day, slots]) => (
                  slots.filter(slot => slot.type !== 'break').map((slot, index) => (
                    <tr key={`${day}-${index}`} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{day}</td>
                      <td className="p-3">{slot.startTime} - {slot.endTime}</td>
                      <td className="p-3">{slot.subject}</td>
                      <td className="p-3">{slot.batch}</td>
                      <td className="p-3">{slot.classroom}</td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {slot.type}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
            {totalClasses === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No classes scheduled</p>
                <p className="text-sm">Your timetable will appear here once approved</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}