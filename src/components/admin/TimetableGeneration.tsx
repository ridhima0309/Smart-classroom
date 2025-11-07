import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Play,
  Download,
  Send,
  GraduationCap
} from 'lucide-react';
import { useAppContext, Timetable, Batch } from '../../App';
import { TimetableGenerator, TimetableConstraints } from '../timetable/TimetableGenerator';
import { TimetableView } from '../timetable/TimetableView';
import { toast } from 'sonner';

export function TimetableGeneration() {
  const { 
    subjects, 
    faculties, 
    classrooms, 
    batches, 
    timetables,
    setTimetables,
    selectedDepartment, 
    selectedShift,
    lunchBreakDuration
  } = useAppContext();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetables, setGeneratedTimetables] = useState<Timetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [showAllDepartments, setShowAllDepartments] = useState(false);

  const constraints: TimetableConstraints = {
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: selectedShift === 'morning' 
      ? [
          { start: '09:00', end: '10:00' },
          { start: '10:00', end: '11:00' },
          { start: '11:15', end: '12:15' },
          { start: '12:15', end: '13:15' },
          { start: '14:15', end: '15:15' },
          { start: '15:15', end: '16:15' }
        ]
      : [
          { start: '14:00', end: '15:00' },
          { start: '15:00', end: '16:00' },
          { start: '16:15', end: '17:15' },
          { start: '17:15', end: '18:15' },
          { start: '19:00', end: '20:00' },
          { start: '20:00', end: '21:00' }
        ],
    lunchBreak: selectedShift === 'morning' 
      ? { start: '13:15', end: '14:15', duration: lunchBreakDuration }
      : { start: '18:15', end: '19:00', duration: 45 },
    maxDailyHours: 6,
    maxConsecutiveHours: 3,
    minBreakBetweenClasses: 15, // 15 minutes minimum break
    maxDailyHoursPerFaculty: 5, // Max 5 hours per day per faculty
    maxConsecutiveHoursPerFaculty: 2 // Max 2 consecutive hours per faculty
  };

  const generateTimetables = async () => {
    const departmentSubjects = subjects.filter(s => s.department === selectedDepartment);
    const departmentFaculties = faculties.filter(f => f.department === selectedDepartment);
    let targetBatches = batches.filter(b => 
      b.department === selectedDepartment && b.shift === selectedShift
    );

    // Filter by selected batch if not "all"
    if (selectedBatch !== 'all') {
      targetBatches = targetBatches.filter(b => b.id === selectedBatch);
    }

    if (departmentSubjects.length === 0) {
      toast.error('Please add subjects for this department first');
      return;
    }

    if (departmentFaculties.length === 0) {
      toast.error('Please add faculties for this department first');
      return;
    }

    if (targetBatches.length === 0) {
      toast.error('Please add batches for this department and shift first');
      return;
    }

    if (classrooms.length === 0) {
      toast.error('Please add classrooms first');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate generation progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Set timeout for the entire generation process
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Generation timeout')), 15000); // 15 seconds
      });

      const generationPromise = new Promise<Timetable[]>((resolve, reject) => {
        try {
          const generator = new TimetableGenerator(
            departmentSubjects,
            departmentFaculties,
            classrooms,
            targetBatches,
            constraints
          );

          let newTimetables: Timetable[] = [];

          if (selectedBatch === 'all') {
            // Generate timetables for each batch individually
            for (const batch of targetBatches) {
              const batchTimetables = generator.generateTimetableForBatch(batch);
              newTimetables.push(...batchTimetables);
            }
          } else {
            // Generate for selected batch only
            const batch = targetBatches[0];
            newTimetables = generator.generateTimetableForBatch(batch);
          }

          resolve(newTimetables);
        } catch (error) {
          reject(error);
        }
      });

      const newTimetables = await Promise.race([generationPromise, timeoutPromise]) as Timetable[];
      
      // Complete progress
      setGenerationProgress(100);
      clearInterval(progressInterval);

      // Check for conflicts in each timetable
      const generator = new TimetableGenerator(
        departmentSubjects,
        departmentFaculties,
        classrooms,
        targetBatches,
        constraints
      );

      newTimetables.forEach(timetable => {
        const conflicts = generator.detectConflicts(timetable);
        if (conflicts.length > 0) {
          console.warn(`Conflicts detected in ${timetable.name}:`, conflicts);
        }
      });

      setGeneratedTimetables(newTimetables);
      setSelectedTimetable(newTimetables[0]);
      
      const message = selectedBatch === 'all' 
        ? `Generated ${newTimetables.length} timetable options for ${targetBatches.length} classes!`
        : `Generated ${newTimetables.length} timetable options for selected class!`;
      
      toast.success(message);
    } catch (error) {
      console.error('Timetable generation error:', error);
      if (error instanceof Error && error.message === 'Generation timeout') {
        toast.error('Timetable generation timed out. Please try with fewer classes or simplified constraints.');
      } else {
        toast.error('Failed to generate timetables. Please check your data and try again.');
      }
      
      // Still show partial results if any were generated
      if (generatedTimetables.length > 0) {
        setSelectedTimetable(generatedTimetables[0]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTimetable = (timetable: Timetable) => {
    const updatedTimetable = {
      ...timetable,
      status: 'draft' as const,
      id: `timetable-${Date.now()}`
    };
    
    setTimetables([...timetables, updatedTimetable]);
    toast.success('Timetable saved as draft');
  };

  const sendForApproval = (timetable: Timetable) => {
    const updatedTimetable = {
      ...timetable,
      status: 'pending' as const,
      id: `timetable-${Date.now()}`
    };
    
    setTimetables([...timetables, updatedTimetable]);
    toast.success('Timetable sent for approval');
  };

  const exportTimetable = (timetable: Timetable) => {
    // Mock export functionality
    toast.success('Timetable exported successfully');
  };

  const departmentSubjects = subjects.filter(s => s.department === selectedDepartment);
  const departmentFaculties = faculties.filter(f => f.department === selectedDepartment);
  const departmentBatches = batches.filter(b => 
    b.department === selectedDepartment && b.shift === selectedShift
  );

  // Get all departments for multi-department view
  const allDepartments = [...new Set(batches.map(b => b.department))];
  const availableBatches = showAllDepartments 
    ? batches.filter(b => b.shift === selectedShift)
    : departmentBatches;

  const readinessChecks = [
    {
      label: 'Subjects configured',
      passed: departmentSubjects.length > 0,
      count: departmentSubjects.length
    },
    {
      label: 'Faculties added',
      passed: departmentFaculties.length > 0,
      count: departmentFaculties.length
    },
    {
      label: 'Classrooms available',
      passed: classrooms.length > 0,
      count: classrooms.length
    },
    {
      label: 'Batches configured',
      passed: departmentBatches.length > 0,
      count: departmentBatches.length
    }
  ];

  const allChecksPass = readinessChecks.every(check => check.passed);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Timetable</h1>
        <p className="text-gray-600">
          Create optimized timetables for individual classes - {selectedShift} shift
        </p>
      </div>

      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Class Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <div className="flex items-center space-x-2">
                <Select value={selectedDepartment} disabled={!showAllDepartments}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allDepartments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAllDepartments(!showAllDepartments)}
                >
                  {showAllDepartments ? 'Single Dept' : 'All Depts'}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Shift</label>
              <Select value={selectedShift} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Class/Batch</label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {availableBatches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name} ({batch.strength} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedBatch !== 'all' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {availableBatches.find(b => b.id === selectedBatch)?.name}
                <br />
                This will generate 3 timetable options specifically for this class.
              </p>
            </div>
          )}

          {selectedBatch === 'all' && availableBatches.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Generating for {availableBatches.length} classes:</strong> {availableBatches.map(b => b.name).join(', ')}
                <br />
                This will create 3 options for each class ({availableBatches.length * 3} total timetables).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Readiness Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Pre-generation Readiness Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {readinessChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {check.passed ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="text-sm">{check.label}</span>
                </div>
                <Badge variant={check.passed ? "default" : "destructive"}>
                  {check.count}
                </Badge>
              </div>
            ))}
          </div>
          
          {!allChecksPass && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Please complete all data input before generating timetables
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2" />
            Timetable Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Generate Multiple Timetable Options</p>
              <p className="text-sm text-gray-600">
                Create 3 optimized timetable variants using different algorithms
              </p>
            </div>
            <Button 
              onClick={generateTimetables}
              disabled={!allChecksPass || isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Generate Timetables
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Generation Progress</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Timetables */}
      {generatedTimetables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Timetable Options ({generatedTimetables.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Group timetables by batch for better organization */}
            {(() => {
              const groupedTimetables = generatedTimetables.reduce((groups, timetable) => {
                const batchName = timetable.name.split(' Timetable')[0];
                if (!groups[batchName]) {
                  groups[batchName] = [];
                }
                groups[batchName].push(timetable);
                return groups;
              }, {} as { [key: string]: Timetable[] });

              return Object.entries(groupedTimetables).map(([batchName, timetables]) => (
                <div key={batchName} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{batchName}</h3>
                      <p className="text-sm text-gray-600">{timetables.length} options generated</p>
                    </div>
                    <Badge variant="outline">{timetables[0].shift}</Badge>
                  </div>

                  <Tabs 
                    value={timetables.find(t => t.id === selectedTimetable?.id)?.id || timetables[0].id} 
                    onValueChange={(value) => {
                      const timetable = timetables.find(t => t.id === value);
                      setSelectedTimetable(timetable || null);
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      {timetables.map((timetable, index) => (
                        <TabsTrigger key={timetable.id} value={timetable.id}>
                          Option {index + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {timetables.map((timetable, index) => (
                      <TabsContent key={timetable.id} value={timetable.id} className="space-y-4">
                        {/* Timetable Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{timetable.name}</h4>
                            <p className="text-sm text-gray-600">
                              {timetable.slots.filter(s => s.type !== 'break').length} scheduled classes
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline"
                              onClick={() => exportTimetable(timetable)}
                              size="sm"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => saveTimetable(timetable)}
                              size="sm"
                            >
                              Save Draft
                            </Button>
                            <Button 
                              onClick={() => sendForApproval(timetable)}
                              size="sm"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send for Approval
                            </Button>
                          </div>
                        </div>

                        {/* Timetable View */}
                        <TimetableView timetable={timetable} />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ));
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}