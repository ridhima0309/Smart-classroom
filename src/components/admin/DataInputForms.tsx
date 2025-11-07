import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { useAppContext, Subject, Faculty, Classroom, Batch } from '../../App';
import { toast } from 'sonner';

export function DataInputForms() {
  const { 
    subjects, setSubjects,
    faculties, setFaculties,
    classrooms, setClassrooms,
    batches, setBatches,
    selectedDepartment,
    lunchBreakDuration, setLunchBreakDuration
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('subjects');

  // Form states
  const [subjectForm, setSubjectForm] = useState({
    name: '', code: '', weeklyHours: 4, type: 'theory', duration: 60
  });
  const [facultyForm, setFacultyForm] = useState({
    name: '', subjects: [] as string[], availability: [] as string[], avgLeavesPerMonth: 2
  });
  const [classroomForm, setClassroomForm] = useState({
    name: '', capacity: 60, type: 'lecture', availability: [] as string[]
  });
  const [batchForm, setBatchForm] = useState({
    name: '', level: 'UG', shift: 'morning', strength: 60
  });

  const departments = ['CSE', 'IT', 'Mechanical', 'Civil', 'Electrical', 'ECE'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubject: Subject = {
      id: Date.now().toString(),
      ...subjectForm,
      department: selectedDepartment
    };
    setSubjects([...subjects, newSubject]);
    setSubjectForm({ name: '', code: '', weeklyHours: 4, type: 'theory', duration: 60 });
    toast.success('Subject added successfully');
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFaculty: Faculty = {
      id: Date.now().toString(),
      ...facultyForm,
      department: selectedDepartment
    };
    setFaculties([...faculties, newFaculty]);
    setFacultyForm({ name: '', subjects: [], availability: [], avgLeavesPerMonth: 2 });
    toast.success('Faculty added successfully');
  };

  const handleClassroomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClassroom: Classroom = {
      id: Date.now().toString(),
      ...classroomForm
    };
    setClassrooms([...classrooms, newClassroom]);
    setClassroomForm({ name: '', capacity: 60, type: 'lecture', availability: [] });
    toast.success('Classroom added successfully');
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: Batch = {
      id: Date.now().toString(),
      ...batchForm,
      department: selectedDepartment,
      shift: batchForm.shift as 'morning' | 'evening'
    };
    setBatches([...batches, newBatch]);
    setBatchForm({ name: '', level: 'UG', shift: 'morning', strength: 60 });
    toast.success('Batch added successfully');
  };

  const deleteItem = (type: string, id: string) => {
    switch (type) {
      case 'subject':
        setSubjects(subjects.filter(s => s.id !== id));
        break;
      case 'faculty':
        setFaculties(faculties.filter(f => f.id !== id));
        break;
      case 'classroom':
        setClassrooms(classrooms.filter(c => c.id !== id));
        break;
      case 'batch':
        setBatches(batches.filter(b => b.id !== id));
        break;
    }
    toast.success('Item deleted successfully');
  };

  const toggleAvailability = (day: string, type: 'faculty' | 'classroom') => {
    if (type === 'faculty') {
      const availability = facultyForm.availability.includes(day)
        ? facultyForm.availability.filter(d => d !== day)
        : [...facultyForm.availability, day];
      setFacultyForm({ ...facultyForm, availability });
    } else {
      const availability = classroomForm.availability.includes(day)
        ? classroomForm.availability.filter(d => d !== day)
        : [...classroomForm.availability, day];
      setClassroomForm({ ...classroomForm, availability });
    }
  };

  const toggleSubjectForFaculty = (subjectId: string) => {
    const subjects = facultyForm.subjects.includes(subjectId)
      ? facultyForm.subjects.filter(s => s !== subjectId)
      : [...facultyForm.subjects, subjectId];
    setFacultyForm({ ...facultyForm, subjects });
  };

  const departmentSubjects = subjects.filter(s => s.department === selectedDepartment);
  const departmentFaculties = faculties.filter(f => f.department === selectedDepartment);
  const departmentBatches = batches.filter(b => b.department === selectedDepartment);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Input</h1>
        <p className="text-gray-600">Configure subjects, faculties, classrooms, and batches</p>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="lunchDuration">Lunch Break Duration (minutes)</Label>
              <Input
                id="lunchDuration"
                type="number"
                value={lunchBreakDuration}
                onChange={(e) => setLunchBreakDuration(Number(e.target.value))}
                min="30"
                max="120"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="faculties">Faculties</TabsTrigger>
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
        </TabsList>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubjectSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="subjectName">Subject Name</Label>
                    <Input
                      id="subjectName"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subjectCode">Subject Code</Label>
                    <Input
                      id="subjectCode"
                      value={subjectForm.code}
                      onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weeklyHours">Weekly Hours</Label>
                      <Input
                        id="weeklyHours"
                        type="number"
                        value={subjectForm.weeklyHours}
                        onChange={(e) => setSubjectForm({ ...subjectForm, weeklyHours: Number(e.target.value) })}
                        min="1"
                        max="10"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={subjectForm.duration}
                        onChange={(e) => setSubjectForm({ ...subjectForm, duration: Number(e.target.value) })}
                        min="30"
                        max="180"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subjectType">Type</Label>
                    <Select 
                      value={subjectForm.type} 
                      onValueChange={(value) => setSubjectForm({ ...subjectForm, type: value as 'theory' | 'lab' | 'elective' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theory">Theory</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="elective">Elective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Subjects ({departmentSubjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {departmentSubjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-gray-600">{subject.code}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{subject.type}</Badge>
                          <Badge variant="secondary">{subject.weeklyHours}h/week</Badge>
                          <Badge variant="secondary">{subject.duration}min</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('subject', subject.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {departmentSubjects.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No subjects added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Faculties Tab */}
        <TabsContent value="faculties" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Faculty</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFacultySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="facultyName">Faculty Name</Label>
                    <Input
                      id="facultyName"
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Subjects Can Teach</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {departmentSubjects.map((subject) => (
                        <div key={subject.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${subject.id}`}
                            checked={facultyForm.subjects.includes(subject.id)}
                            onCheckedChange={() => toggleSubjectForFaculty(subject.id)}
                          />
                          <Label htmlFor={`subject-${subject.id}`} className="text-sm">
                            {subject.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Availability</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {days.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`faculty-${day}`}
                            checked={facultyForm.availability.includes(day)}
                            onCheckedChange={() => toggleAvailability(day, 'faculty')}
                          />
                          <Label htmlFor={`faculty-${day}`} className="text-sm">
                            {day.slice(0, 3)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="avgLeaves">Average Leaves per Month</Label>
                    <Input
                      id="avgLeaves"
                      type="number"
                      value={facultyForm.avgLeavesPerMonth}
                      onChange={(e) => setFacultyForm({ ...facultyForm, avgLeavesPerMonth: Number(e.target.value) })}
                      min="0"
                      max="10"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Faculty
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Faculties ({departmentFaculties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {departmentFaculties.map((faculty) => (
                    <div key={faculty.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{faculty.name}</p>
                        <p className="text-sm text-gray-600">
                          {faculty.subjects.length} subjects, {faculty.availability.length} days available
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge variant="secondary">{faculty.avgLeavesPerMonth} leaves/month</Badge>
                          {faculty.isOnLeave && <Badge variant="destructive">On Leave</Badge>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('faculty', faculty.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {departmentFaculties.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No faculties added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Classrooms Tab */}
        <TabsContent value="classrooms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Classroom</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleClassroomSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="classroomName">Classroom Name</Label>
                    <Input
                      id="classroomName"
                      value={classroomForm.name}
                      onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })}
                      placeholder="e.g., Room 101, Lab A1"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={classroomForm.capacity}
                        onChange={(e) => setClassroomForm({ ...classroomForm, capacity: Number(e.target.value) })}
                        min="20"
                        max="200"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="classroomType">Type</Label>
                      <Select 
                        value={classroomForm.type} 
                        onValueChange={(value) => setClassroomForm({ ...classroomForm, type: value as 'lecture' | 'lab' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lecture">Lecture Hall</SelectItem>
                          <SelectItem value="lab">Laboratory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Availability</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {days.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`classroom-${day}`}
                            checked={classroomForm.availability.includes(day)}
                            onCheckedChange={() => toggleAvailability(day, 'classroom')}
                          />
                          <Label htmlFor={`classroom-${day}`} className="text-sm">
                            {day.slice(0, 3)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Classroom
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Classrooms ({classrooms.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {classrooms.map((classroom) => (
                    <div key={classroom.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{classroom.name}</p>
                        <p className="text-sm text-gray-600">
                          Capacity: {classroom.capacity}, Available: {classroom.availability.length} days
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {classroom.type === 'lecture' ? 'Lecture Hall' : 'Laboratory'}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('classroom', classroom.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {classrooms.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No classrooms added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Batches Tab */}
        <TabsContent value="batches" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Batch</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBatchSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="batchName">Batch Name</Label>
                    <Input
                      id="batchName"
                      value={batchForm.name}
                      onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                      placeholder="e.g., CSE-A, IT-2023"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="level">Level</Label>
                      <Select 
                        value={batchForm.level} 
                        onValueChange={(value) => setBatchForm({ ...batchForm, level: value as 'UG' | 'PG' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UG">Undergraduate</SelectItem>
                          <SelectItem value="PG">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="shift">Shift</Label>
                      <Select 
                        value={batchForm.shift} 
                        onValueChange={(value) => setBatchForm({ ...batchForm, shift: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="strength">Batch Strength</Label>
                    <Input
                      id="strength"
                      type="number"
                      value={batchForm.strength}
                      onChange={(e) => setBatchForm({ ...batchForm, strength: Number(e.target.value) })}
                      min="20"
                      max="120"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Batch
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Batches ({departmentBatches.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {departmentBatches.map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{batch.name}</p>
                        <p className="text-sm text-gray-600">
                          {batch.level} • {batch.strength} students
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {batch.shift} shift
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('batch', batch.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {departmentBatches.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No batches added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}