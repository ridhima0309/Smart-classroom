import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, User, MapPin, Users, AlertTriangle } from 'lucide-react';
import { Timetable, TimeSlot } from '../../App';

interface TimetableViewProps {
  timetable: Timetable;
  showWatermark?: boolean;
  editable?: boolean;
}

export function TimetableView({ timetable, showWatermark = true, editable = false }: TimetableViewProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = timetable.shift === 'morning' 
    ? [
        '09:00-10:00', '10:00-11:00', '11:15-12:15', '12:15-13:15',
        '13:15-14:15', '14:15-15:15', '15:15-16:15'
      ]
    : [
        '14:00-15:00', '15:00-16:00', '16:15-17:15', '17:15-18:15',
        '18:15-19:00', '19:00-20:00', '20:00-21:00'
      ];

  // Organize slots by day and time
  const scheduleGrid: { [key: string]: { [key: string]: TimeSlot | null } } = {};
  
  days.forEach(day => {
    scheduleGrid[day] = {};
    timeSlots.forEach(slot => {
      scheduleGrid[day][slot] = null;
    });
  });

  // Fill the grid with actual slots
  timetable.slots.forEach(slot => {
    const timeKey = `${slot.startTime}-${slot.endTime}`;
    if (scheduleGrid[slot.day]) {
      scheduleGrid[slot.day][timeKey] = slot;
    }
  });

  const getSlotColor = (slot: TimeSlot | null) => {
    if (!slot) return 'bg-gray-50';
    
    switch (slot.type) {
      case 'break':
        return 'bg-yellow-100 border-yellow-200';
      case 'lab':
        return 'bg-purple-100 border-purple-200';
      case 'lecture':
        return 'bg-blue-100 border-blue-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Timetable Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{timetable.name}</h3>
          <p className="text-sm text-gray-600">
            {timetable.department} Department • {timetable.shift} Shift
          </p>
        </div>
        {showWatermark && getStatusBadge(timetable.status)}
      </div>

      {/* Timetable Grid */}
      <Card className="relative overflow-hidden">
        {showWatermark && (
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10`}>
            <div className={`text-6xl font-bold opacity-10 rotate-45 ${getStatusColor(timetable.status)}`}>
              {timetable.status.toUpperCase()}
            </div>
          </div>
        )}
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left font-medium text-gray-900 min-w-[120px]">
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} className="p-3 text-center font-medium text-gray-900 min-w-[140px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeSlot => (
                  <tr key={timeSlot} className="border-b">
                    <td className="p-3 font-medium text-gray-700 bg-gray-50">
                      {timeSlot}
                    </td>
                    {days.map(day => {
                      const slot = scheduleGrid[day][timeSlot];
                      return (
                        <td key={`${day}-${timeSlot}`} className="p-1">
                          <div className={`p-2 rounded-lg border h-20 ${getSlotColor(slot)}`}>
                            {slot ? (
                              <div className="space-y-1">
                                <p className="font-medium text-xs truncate">
                                  {slot.subject}
                                </p>
                                {slot.type !== 'break' && (
                                  <>
                                    <div className="flex items-center text-xs text-gray-600">
                                      <User className="h-3 w-3 mr-1" />
                                      <span className="truncate">{slot.faculty}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-600">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span className="truncate">{slot.classroom}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-600">
                                      <Users className="h-3 w-3 mr-1" />
                                      <span className="truncate">{slot.batch}</span>
                                    </div>
                                  </>
                                )}
                                {slot.type === 'break' && (
                                  <div className="flex items-center justify-center h-8">
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-gray-400">
                                <span className="text-xs">Free</span>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
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
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
          <span>Free</span>
        </div>
      </div>

      {/* Timetable Metadata */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Created by {timetable.createdBy} on {new Date(timetable.createdAt).toLocaleDateString()}</p>
        {timetable.approvedBy && (
          <p>Approved by {timetable.approvedBy} on {new Date(timetable.approvedAt!).toLocaleDateString()}</p>
        )}
        {timetable.comments && (
          <p className="text-yellow-600">Comments: {timetable.comments}</p>
        )}
      </div>
    </div>
  );
}