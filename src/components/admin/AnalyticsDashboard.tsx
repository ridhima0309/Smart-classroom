import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  Clock, 
  Building, 
  BookOpen, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useAppContext } from '../../App';

export function AnalyticsDashboard() {
  const { 
    subjects, 
    faculties, 
    classrooms, 
    batches, 
    timetables, 
    selectedDepartment, 
    selectedShift 
  } = useAppContext();

  // Filter data for selected department and shift
  const departmentSubjects = subjects.filter(s => s.department === selectedDepartment);
  const departmentFaculties = faculties.filter(f => f.department === selectedDepartment);
  const departmentBatches = batches.filter(b => 
    b.department === selectedDepartment && b.shift === selectedShift
  );
  const approvedTimetables = timetables.filter(t => 
    t.status === 'approved' && 
    t.department === selectedDepartment && 
    t.shift === selectedShift
  );

  // Faculty workload distribution data
  const facultyWorkloadData = departmentFaculties.map(faculty => {
    let totalHours = 0;
    approvedTimetables.forEach(timetable => {
      const facultySlots = timetable.slots.filter(slot => 
        slot.faculty === faculty.name && slot.type !== 'break'
      );
      totalHours += facultySlots.reduce((sum, slot) => sum + (slot.duration / 60), 0);
    });
    
    return {
      name: faculty.name.split(' ').map(n => n[0]).join(''), // Initials for chart
      fullName: faculty.name,
      hours: totalHours,
      subjects: faculty.subjects.length,
      isOnLeave: faculty.isOnLeave || false
    };
  });

  // Classroom utilization data
  const classroomUtilizationData = classrooms.map(classroom => {
    let totalSlots = 0;
    let occupiedSlots = 0;
    
    approvedTimetables.forEach(timetable => {
      const timeSlots = timetable.shift === 'morning' ? 6 : 6; // 6 slots per day
      const workingDays = 6; // Monday to Saturday
      totalSlots += timeSlots * workingDays;
      
      const classroomSlots = timetable.slots.filter(slot => 
        slot.classroom === classroom.name && slot.type !== 'break'
      );
      occupiedSlots += classroomSlots.length;
    });
    
    const utilization = totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;
    
    return {
      name: classroom.name,
      utilization: Math.round(utilization),
      type: classroom.type,
      capacity: classroom.capacity
    };
  });

  // Subject coverage data
  const subjectCoverageData = departmentSubjects.map(subject => {
    let totalScheduledHours = 0;
    
    approvedTimetables.forEach(timetable => {
      const subjectSlots = timetable.slots.filter(slot => 
        slot.subject === subject.name && slot.type !== 'break'
      );
      totalScheduledHours += subjectSlots.reduce((sum, slot) => sum + (slot.duration / 60), 0);
    });
    
    const coverage = subject.weeklyHours > 0 ? (totalScheduledHours / subject.weeklyHours) * 100 : 0;
    
    return {
      name: subject.name,
      code: subject.code,
      scheduled: totalScheduledHours,
      required: subject.weeklyHours,
      coverage: Math.round(coverage)
    };
  });

  // Color schemes for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  const pieData = [
    { name: 'Lecture Halls', value: classrooms.filter(c => c.type === 'lecture').length },
    { name: 'Laboratories', value: classrooms.filter(c => c.type === 'lab').length }
  ];

  // Weekly trend data (mock data for demonstration)
  const weeklyTrendData = [
    { week: 'Week 1', efficiency: 85, conflicts: 5 },
    { week: 'Week 2', efficiency: 88, conflicts: 3 },
    { week: 'Week 3', efficiency: 92, conflicts: 2 },
    { week: 'Week 4', efficiency: 89, conflicts: 4 },
  ];

  const totalFaculties = departmentFaculties.length;
  const facultiesOnLeave = departmentFaculties.filter(f => f.isOnLeave).length;
  const avgClassroomUtilization = classroomUtilizationData.length > 0 
    ? Math.round(classroomUtilizationData.reduce((sum, c) => sum + c.utilization, 0) / classroomUtilizationData.length)
    : 0;
  const avgSubjectCoverage = subjectCoverageData.length > 0
    ? Math.round(subjectCoverageData.reduce((sum, s) => sum + s.coverage, 0) / subjectCoverageData.length)
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Performance insights for {selectedDepartment} Department - {selectedShift} shift
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Faculty Availability</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalFaculties - facultiesOnLeave}/{totalFaculties}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress 
              value={totalFaculties > 0 ? ((totalFaculties - facultiesOnLeave) / totalFaculties) * 100 : 0} 
              className="mt-3" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Classroom Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{avgClassroomUtilization}%</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={avgClassroomUtilization} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subject Coverage</p>
                <p className="text-2xl font-bold text-gray-900">{avgSubjectCoverage}%</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Progress value={avgSubjectCoverage} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Timetables</p>
                <p className="text-2xl font-bold text-gray-900">{approvedTimetables.length}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Workload Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Faculty Workload Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facultyWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} hours`, 
                    name === 'hours' ? 'Weekly Hours' : name
                  ]}
                  labelFormatter={(label) => {
                    const faculty = facultyWorkloadData.find(f => f.name === label);
                    return faculty ? faculty.fullName : label;
                  }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#8884d8"
                  name="hours"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Classroom Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Classroom Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classroom Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Classroom Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classroomUtilizationData.map((classroom, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{classroom.name}</span>
                      <Badge variant="outline">
                        {classroom.type === 'lecture' ? 'Lecture' : 'Lab'}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{classroom.utilization}%</span>
                  </div>
                  <Progress value={classroom.utilization} className="h-2" />
                </div>
              ))}
              {classroomUtilizationData.length === 0 && (
                <p className="text-gray-500 text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Efficiency Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Weekly Efficiency Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Efficiency %"
                />
                <Line 
                  type="monotone" 
                  dataKey="conflicts" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Conflicts"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Coverage Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Subject Coverage Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectCoverageData.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{subject.name}</span>
                    <Badge variant="outline">{subject.code}</Badge>
                    {subject.coverage < 80 && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {subject.scheduled}h/{subject.required}h ({subject.coverage}%)
                  </div>
                </div>
                <Progress 
                  value={subject.coverage} 
                  className={`h-2 ${subject.coverage < 80 ? 'bg-yellow-100' : ''}`}
                />
              </div>
            ))}
            {subjectCoverageData.length === 0 && (
              <p className="text-gray-500 text-center py-4">No subjects configured</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}