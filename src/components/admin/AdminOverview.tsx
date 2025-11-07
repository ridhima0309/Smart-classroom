import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Building,
  GraduationCap
} from 'lucide-react';
import { useAppContext } from '../../App';

export function AdminOverview() {
  const { 
    subjects, 
    faculties, 
    classrooms, 
    batches, 
    timetables, 
    selectedDepartment, 
    selectedShift 
  } = useAppContext();

  const stats = [
    {
      title: 'Total Subjects',
      value: subjects.filter(s => s.department === selectedDepartment).length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Faculty Members',
      value: faculties.filter(f => f.department === selectedDepartment).length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Classrooms',
      value: classrooms.length,
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Batches',
      value: batches.filter(b => b.department === selectedDepartment && b.shift === selectedShift).length,
      icon: GraduationCap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const pendingTimetables = timetables.filter(t => t.status === 'pending').length;
  const approvedTimetables = timetables.filter(t => t.status === 'approved').length;
  const draftTimetables = timetables.filter(t => t.status === 'draft').length;

  const totalFaculties = faculties.filter(f => f.department === selectedDepartment).length;
  const facultiesOnLeave = faculties.filter(f => f.department === selectedDepartment && f.isOnLeave).length;
  const availabilityRate = totalFaculties > 0 ? ((totalFaculties - facultiesOnLeave) / totalFaculties) * 100 : 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          {selectedDepartment} Department - {selectedShift.charAt(0).toUpperCase() + selectedShift.slice(1)} Shift
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timetable Status and Faculty Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timetable Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Timetable Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timetables.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No timetables created yet</p>
                <p className="text-sm text-gray-400">Use the "Generate Timetable" feature to create optimized schedules</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm">Draft</span>
                  </div>
                  <Badge variant="secondary">{draftTimetables}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">Pending Approval</span>
                  </div>
                  <Badge variant="outline">{pendingTimetables}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Approved</span>
                  </div>
                  <Badge>{approvedTimetables}</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Faculty Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Faculty Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Available Faculty</span>
              <span className="font-medium">{totalFaculties - facultiesOnLeave}/{totalFaculties}</span>
            </div>
            <Progress value={availabilityRate} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                {totalFaculties - facultiesOnLeave} Available
              </div>
              {facultiesOnLeave > 0 && (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {facultiesOnLeave} On Leave
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
            {timetables.slice(0, 5).map((timetable, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium">{timetable.name}</p>
                  <p className="text-sm text-gray-600">
                    Created on {new Date(timetable.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge 
                  variant={
                    timetable.status === 'approved' ? 'default' : 
                    timetable.status === 'pending' ? 'secondary' : 
                    'outline'
                  }
                >
                  {timetable.status.charAt(0).toUpperCase() + timetable.status.slice(1)}
                </Badge>
              </div>
            ))}
            {timetables.length === 0 && (
              <p className="text-gray-500 text-center py-4">No timetables created yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}