import { Subject, Faculty, Classroom, Batch, TimeSlot, Timetable } from '../../App';

export interface TimetableConstraints {
  workingDays: string[];
  timeSlots: { start: string; end: string }[];
  lunchBreak: { start: string; end: string; duration: number };
  maxDailyHours: number;
  maxConsecutiveHours: number;
  minBreakBetweenClasses: number; // in minutes
  maxDailyHoursPerFaculty: number;
  maxConsecutiveHoursPerFaculty: number;
}

export class TimetableGenerator {
  private subjects: Subject[];
  private faculties: Faculty[];
  private classrooms: Classroom[];
  private batches: Batch[];
  private constraints: TimetableConstraints;

  constructor(
    subjects: Subject[],
    faculties: Faculty[],
    classrooms: Classroom[],
    batches: Batch[],
    constraints: TimetableConstraints
  ) {
    this.subjects = subjects;
    this.faculties = faculties;
    this.classrooms = classrooms;
    this.batches = batches;
    this.constraints = constraints;
  }

  generateTimetable(department: string, shift: 'morning' | 'evening'): Timetable[] {
    const relevantBatches = this.batches.filter(b => b.department === department && b.shift === shift);
    const relevantSubjects = this.subjects.filter(s => s.department === department);
    const relevantFaculties = this.faculties.filter(f => f.department === department);

    const timetables: Timetable[] = [];

    // Generate 3 different optimized timetables for comparison
    for (let i = 0; i < 3; i++) {
      const timetable = this.createTimetableVariant(
        relevantBatches,
        relevantSubjects,
        relevantFaculties,
        department,
        shift,
        i
      );
      timetables.push(timetable);
    }

    return timetables;
  }

  generateTimetableForBatch(batch: Batch): Timetable[] {
    const relevantSubjects = this.subjects.filter(s => s.department === batch.department);
    const relevantFaculties = this.faculties.filter(f => f.department === batch.department);

    const timetables: Timetable[] = [];

    // Generate 3 different optimized timetables for this specific batch
    for (let i = 0; i < 3; i++) {
      const timetable = this.createSingleBatchTimetable(
        batch,
        relevantSubjects,
        relevantFaculties,
        i
      );
      timetables.push(timetable);
    }

    return timetables;
  }

  private createTimetableVariant(
    batches: Batch[],
    subjects: Subject[],
    faculties: Faculty[],
    department: string,
    shift: 'morning' | 'evening',
    variant: number
  ): Timetable {
    const slots: TimeSlot[] = [];
    const timeSlots = this.getTimeSlots(shift);
    
    // Create a scheduling grid
    const schedule: { [key: string]: { [key: string]: TimeSlot | null } } = {};
    
    // Faculty workload tracking
    const facultyWorkload: { [key: string]: { [key: string]: number } } = {}; // faculty -> day -> hours
    const facultyDailySlots: { [key: string]: { [key: string]: TimeSlot[] } } = {}; // faculty -> day -> slots
    
    // Initialize tracking structures
    faculties.forEach(faculty => {
      facultyWorkload[faculty.name] = {};
      facultyDailySlots[faculty.name] = {};
      this.constraints.workingDays.forEach(day => {
        facultyWorkload[faculty.name][day] = 0;
        facultyDailySlots[faculty.name][day] = [];
      });
    });
    
    // Initialize schedule grid
    this.constraints.workingDays.forEach(day => {
      schedule[day] = {};
      timeSlots.forEach((slot, index) => {
        schedule[day][`${slot.start}-${slot.end}`] = null;
      });
    });

    // Add lunch break
    this.constraints.workingDays.forEach(day => {
      const lunchSlot: TimeSlot = {
        id: `lunch-${day}`,
        day,
        startTime: this.constraints.lunchBreak.start,
        endTime: this.constraints.lunchBreak.end,
        subject: 'Lunch Break',
        faculty: '',
        classroom: '',
        batch: '',
        type: 'break',
        duration: this.constraints.lunchBreak.duration
      };
      schedule[day][`${this.constraints.lunchBreak.start}-${this.constraints.lunchBreak.end}`] = lunchSlot;
      slots.push(lunchSlot);
    });

    // Different scheduling strategies for variants
    const sortedBatches = this.sortBatchesForVariant(batches, variant);

    // Schedule subjects for each batch with proper workload tracking
    sortedBatches.forEach(batch => {
      this.scheduleSubjectsForBatchWithWorkload(batch, subjects, faculties, schedule, slots, variant, facultyWorkload, facultyDailySlots);
    });

    return {
      id: `timetable-${Date.now()}-${variant}`,
      name: `${department} ${shift} Timetable v${variant + 1}`,
      department,
      shift,
      status: 'draft',
      slots,
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };
  }

  private sortBatchesForVariant(batches: Batch[], variant: number): Batch[] {
    const sorted = [...batches];
    switch (variant) {
      case 0:
        // Priority to first years, then second, etc.
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 1:
        // Priority to final years first
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 2:
        // Alternate between different years
        const firstYears = sorted.filter(b => b.name.includes('1'));
        const secondYears = sorted.filter(b => b.name.includes('2'));
        const thirdYears = sorted.filter(b => b.name.includes('3'));
        const fourthYears = sorted.filter(b => b.name.includes('4'));
        return [...firstYears, ...secondYears, ...thirdYears, ...fourthYears];
      default:
        return sorted;
    }
  }

  private scheduleSubjectsForBatchWithWorkload(
    batch: Batch,
    subjects: Subject[],
    faculties: Faculty[],
    schedule: { [key: string]: { [key: string]: TimeSlot | null } },
    slots: TimeSlot[],
    variant: number,
    facultyWorkload: { [key: string]: { [key: string]: number } },
    facultyDailySlots: { [key: string]: { [key: string]: TimeSlot[] } }
  ) {
    // Filter subjects based on batch year/semester
    const batchSubjects = this.getSubjectsForBatch(batch, subjects);

    // Calculate total weekly hours needed
    const subjectHours: { [key: string]: number } = {};
    batchSubjects.forEach(subject => {
      subjectHours[subject.id] = subject.weeklyHours;
    });

    // Schedule algorithm with different strategies based on variant
    const strategy = variant === 0 ? 'balanced' : variant === 1 ? 'concentrated' : 'distributed';
    
    // Add maximum attempts to prevent infinite loops
    const MAX_ATTEMPTS_PER_SUBJECT = 100;
    const MAX_SCHEDULING_TIME = 5000; // 5 seconds max per batch
    const startTime = Date.now();
    
    Object.keys(subjectHours).forEach(subjectId => {
      // Check if we've exceeded time limit
      if (Date.now() - startTime > MAX_SCHEDULING_TIME) {
        console.warn(`Scheduling timeout for batch ${batch.name}, stopping at subject ${subjectId}`);
        return;
      }

      const subject = batchSubjects.find(s => s.id === subjectId)!;
      
      // Filter faculty by both subject and assigned classes
      const availableFaculties = faculties.filter(f => 
        f.subjects.includes(subject.id) && 
        f.assignedClasses.includes(batch.id) && 
        !f.isOnLeave
      );

      if (availableFaculties.length === 0) {
        console.warn(`No available faculty for subject ${subject.name} in batch ${batch.name}`);
        return;
      }

      let hoursScheduled = 0;
      const hoursNeeded = subjectHours[subjectId];
      let attempts = 0;

      // Apply variant-specific faculty selection
      const selectedFaculties = this.selectFacultiesForVariant(availableFaculties, strategy, variant);

      // Try multiple faculty members if one is overloaded
      for (const faculty of selectedFaculties) {
        if (hoursScheduled >= hoursNeeded || attempts >= MAX_ATTEMPTS_PER_SUBJECT) break;

        // Schedule sessions for this subject with this faculty
        for (const day of this.constraints.workingDays) {
          if (hoursScheduled >= hoursNeeded || attempts >= MAX_ATTEMPTS_PER_SUBJECT) break;

          // Check if faculty has reached daily limit
          if (facultyWorkload[faculty.name][day] >= this.constraints.maxDailyHoursPerFaculty) {
            continue;
          }

          const availableSlots = this.getAvailableSlotsWithWorkload(
            day, 
            schedule, 
            batch, 
            faculty, 
            facultyDailySlots[faculty.name][day]
          );
          
          for (const slot of availableSlots) {
            if (hoursScheduled >= hoursNeeded || attempts >= MAX_ATTEMPTS_PER_SUBJECT) break;
            attempts++;

            // Check faculty daily limit
            if (facultyWorkload[faculty.name][day] >= this.constraints.maxDailyHoursPerFaculty) {
              break;
            }

            const classroom = this.findAvailableClassroom(day, slot, subject.type, schedule);
            if (!classroom) continue;

            const duration = subject.duration;
            const sessionHours = duration / 60; // Convert minutes to hours

            // Simplified consecutive hours check to prevent performance issues
            if (this.wouldViolateConsecutiveHoursSimplified(faculty.name, day, slot, facultyDailySlots[faculty.name][day])) {
              continue;
            }

            if (hoursScheduled + sessionHours <= hoursNeeded) {
              const timeSlot: TimeSlot = {
                id: `${batch.id}-${subject.id}-${day}-${slot.start}-${Date.now()}-${Math.random()}`,
                day,
                startTime: slot.start,
                endTime: slot.end,
                subject: subject.name,
                faculty: faculty.name,
                classroom: classroom.name,
                batch: batch.name,
                type: subject.type === 'lab' ? 'lab' : 'lecture',
                duration
              };

              schedule[day][`${slot.start}-${slot.end}`] = timeSlot;
              slots.push(timeSlot);
              hoursScheduled += sessionHours;
              
              // Update faculty workload tracking
              facultyWorkload[faculty.name][day] += sessionHours;
              facultyDailySlots[faculty.name][day].push(timeSlot);
            }
          }
        }
      }
    });
  }

  private selectFacultiesForVariant(faculties: Faculty[], strategy: string, variant: number): Faculty[] {
    const shuffled = [...faculties];
    
    // Apply different sorting strategies for variants
    switch (variant) {
      case 0:
        // Balanced: Sort by workload (least loaded first)
        return shuffled.sort((a, b) => a.assignedClasses.length - b.assignedClasses.length);
      case 1:
        // Concentrated: Prefer faculty with more assigned classes
        return shuffled.sort((a, b) => b.assignedClasses.length - a.assignedClasses.length);
      case 2:
        // Distributed: Random order with preference for available faculty
        return shuffled.sort(() => Math.random() - 0.5);
      default:
        return shuffled;
    }
  }

  private wouldViolateConsecutiveHoursSimplified(
    facultyName: string, 
    day: string, 
    newSlot: { start: string; end: string },
    existingSlots: TimeSlot[]
  ): boolean {
    // Simplified version to prevent performance issues
    if (existingSlots.length === 0) return false;
    
    const newSlotStart = this.timeToMinutes(newSlot.start);
    const newSlotEnd = this.timeToMinutes(newSlot.end);
    
    // Count consecutive slots around this time
    let consecutiveCount = 1; // Current slot
    
    // Check immediately adjacent slots only
    for (const slot of existingSlots) {
      if (slot.day !== day || slot.faculty !== facultyName) continue;
      
      const slotStart = this.timeToMinutes(slot.startTime);
      const slotEnd = this.timeToMinutes(slot.endTime);
      
      // Check if slots are immediately adjacent (within break time)
      if (Math.abs(slotEnd - newSlotStart) <= this.constraints.minBreakBetweenClasses ||
          Math.abs(newSlotEnd - slotStart) <= this.constraints.minBreakBetweenClasses) {
        consecutiveCount++;
        if (consecutiveCount > this.constraints.maxConsecutiveHoursPerFaculty) {
          return true;
        }
      }
    }
    
    return false;
  }

  private createSingleBatchTimetable(
    batch: Batch,
    subjects: Subject[],
    faculties: Faculty[],
    variant: number
  ): Timetable {
    const slots: TimeSlot[] = [];
    const timeSlots = this.getTimeSlots(batch.shift);
    
    // Create a scheduling grid
    const schedule: { [key: string]: { [key: string]: TimeSlot | null } } = {};
    
    // Faculty workload tracking
    const facultyWorkload: { [key: string]: { [key: string]: number } } = {}; // faculty -> day -> hours
    const facultyDailySlots: { [key: string]: { [key: string]: TimeSlot[] } } = {}; // faculty -> day -> slots
    
    // Initialize tracking structures
    faculties.forEach(faculty => {
      facultyWorkload[faculty.name] = {};
      facultyDailySlots[faculty.name] = {};
      this.constraints.workingDays.forEach(day => {
        facultyWorkload[faculty.name][day] = 0;
        facultyDailySlots[faculty.name][day] = [];
      });
    });
    
    // Initialize schedule grid
    this.constraints.workingDays.forEach(day => {
      schedule[day] = {};
      timeSlots.forEach((slot, index) => {
        schedule[day][`${slot.start}-${slot.end}`] = null;
      });
    });

    // Add lunch/dinner break
    this.constraints.workingDays.forEach(day => {
      const breakSlot: TimeSlot = {
        id: `break-${day}-${batch.id}`,
        day,
        startTime: this.constraints.lunchBreak.start,
        endTime: this.constraints.lunchBreak.end,
        subject: batch.shift === 'morning' ? 'Lunch Break' : 'Dinner Break',
        faculty: '',
        classroom: '',
        batch: batch.name,
        type: 'break',
        duration: this.constraints.lunchBreak.duration
      };
      schedule[day][`${this.constraints.lunchBreak.start}-${this.constraints.lunchBreak.end}`] = breakSlot;
      slots.push(breakSlot);
    });

    // Schedule subjects for this specific batch with workload tracking
    this.scheduleSubjectsForBatchWithWorkload(batch, subjects, faculties, schedule, slots, variant, facultyWorkload, facultyDailySlots);

    return {
      id: `timetable-${batch.id}-${Date.now()}-${variant}`,
      name: `${batch.name} Timetable v${variant + 1}`,
      department: batch.department,
      shift: batch.shift,
      status: 'draft',
      slots,
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };
  }

  private scheduleSubjectsForBatch(
    batch: Batch,
    subjects: Subject[],
    faculties: Faculty[],
    schedule: { [key: string]: { [key: string]: TimeSlot | null } },
    slots: TimeSlot[],
    variant: number
  ) {
    // This method is deprecated - use scheduleSubjectsForBatchWithWorkload instead
    console.warn('scheduleSubjectsForBatch is deprecated, using scheduleSubjectsForBatchWithWorkload');
  }

  private getSubjectsForBatch(batch: Batch, subjects: Subject[]): Subject[] {
    const department = batch.department;
    
    // Map batch names to appropriate subjects based on department and year
    if (batch.name.includes('1A') || batch.name.includes('1B') || batch.name.includes('1C')) {
      // First year subjects
      if (department === 'CSE') {
        return subjects.filter(s => 
          s.department === 'CSE' && (s.code.startsWith('CSE1') || s.code.startsWith('MATH1') || s.code.startsWith('PHY1'))
        );
      } else if (department === 'ECE') {
        return subjects.filter(s => 
          s.department === 'ECE' && s.code.startsWith('ECE1')
        );
      } else if (department === 'MECH') {
        return subjects.filter(s => 
          s.department === 'MECH' && s.code.startsWith('MECH1')
        );
      }
    } else if (batch.name.includes('2A') || batch.name.includes('2B') || batch.name.includes('2C')) {
      // Second year subjects
      if (department === 'CSE') {
        return subjects.filter(s => s.department === 'CSE' && s.code.startsWith('CSE2'));
      } else if (department === 'ECE') {
        return subjects.filter(s => s.department === 'ECE' && s.code.startsWith('ECE2'));
      } else if (department === 'MECH') {
        return subjects.filter(s => s.department === 'MECH' && s.code.startsWith('MECH2'));
      }
    } else if (batch.name.includes('3A') || batch.name.includes('3B') || batch.name.includes('3C')) {
      // Third year subjects
      if (department === 'CSE') {
        return subjects.filter(s => s.department === 'CSE' && s.code.startsWith('CSE3'));
      } else if (department === 'ECE') {
        return subjects.filter(s => s.department === 'ECE' && s.code.startsWith('ECE3'));
      } else if (department === 'MECH') {
        return subjects.filter(s => s.department === 'MECH' && s.code.startsWith('MECH3'));
      }
    } else if (batch.name.includes('4A') || batch.name.includes('4B') || batch.name.includes('4C')) {
      // Fourth year subjects
      if (department === 'CSE') {
        return subjects.filter(s => s.department === 'CSE' && s.code.startsWith('CSE4'));
      }
    }
    
    // Fallback - return all subjects for the department
    return subjects.filter(s => s.department === department);
  }

  private findAvailableClassroom(
    day: string, 
    slot: { start: string; end: string }, 
    type: string,
    schedule: { [key: string]: { [key: string]: TimeSlot | null } }
  ): Classroom | null {
    const suitableClassrooms = this.classrooms.filter(c => 
      c.type === type || (c.type === 'lecture' && type === 'theory') || (c.type === 'lecture' && type === 'elective')
    );

    // Check classroom availability and conflicts
    for (const classroom of suitableClassrooms) {
      if (classroom.availability.includes(day)) {
        // Check if classroom is already booked at this time
        const isClassroomFree = this.checkClassroomAvailability(day, slot, classroom, schedule);
        if (isClassroomFree) {
          return classroom;
        }
      }
    }

    return null; // No available classroom
  }

  private checkClassroomAvailability(
    day: string,
    slot: { start: string; end: string },
    classroom: Classroom,
    schedule: { [key: string]: { [key: string]: TimeSlot | null } }
  ): boolean {
    // Check all scheduled slots for this day
    const daySchedule = schedule[day];
    for (const timeSlot of Object.values(daySchedule)) {
      if (timeSlot && timeSlot.classroom === classroom.name && timeSlot.type !== 'break') {
        // Check if time slots overlap
        if (this.timeSlotsOverlap(slot, { start: timeSlot.startTime, end: timeSlot.endTime })) {
          return false; // Classroom is occupied
        }
      }
    }
    return true; // Classroom is available
  }

  detectConflicts(timetable: Timetable): string[] {
    const conflicts: string[] = [];
    const facultySchedule: { [key: string]: TimeSlot[] } = {};
    const classroomSchedule: { [key: string]: TimeSlot[] } = {};

    // Group slots by faculty and classroom
    timetable.slots.forEach(slot => {
      if (slot.type === 'break') return;

      if (!facultySchedule[slot.faculty]) {
        facultySchedule[slot.faculty] = [];
      }
      facultySchedule[slot.faculty].push(slot);

      if (!classroomSchedule[slot.classroom]) {
        classroomSchedule[slot.classroom] = [];
      }
      classroomSchedule[slot.classroom].push(slot);
    });

    // Check faculty conflicts
    Object.entries(facultySchedule).forEach(([faculty, slots]) => {
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          if (this.slotsOverlap(slots[i], slots[j])) {
            conflicts.push(`Faculty ${faculty} has overlapping classes: ${slots[i].subject} and ${slots[j].subject}`);
          }
        }
      }
    });

    // Check classroom conflicts
    Object.entries(classroomSchedule).forEach(([classroom, slots]) => {
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          if (this.slotsOverlap(slots[i], slots[j])) {
            conflicts.push(`Classroom ${classroom} has overlapping bookings: ${slots[i].subject} and ${slots[j].subject}`);
          }
        }
      }
    });

    return conflicts;
  }

  private slotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
    if (slot1.day !== slot2.day) return false;
    
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    return start1 < end2 && start2 < end1;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private getTimeSlots(shift: 'morning' | 'evening') {
    if (shift === 'morning') {
      return [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:15', end: '12:15' },
        { start: '12:15', end: '13:15' },
        // Lunch break 13:15 - 14:15
        { start: '14:15', end: '15:15' },
        { start: '15:15', end: '16:15' }
      ];
    } else {
      return [
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:15', end: '17:15' },
        { start: '17:15', end: '18:15' },
        // Dinner break 18:15 - 19:00
        { start: '19:00', end: '20:00' },
        { start: '20:00', end: '21:00' }
      ];
    }
  }

  private selectFaculty(faculties: Faculty[], strategy: string): Faculty {
    switch (strategy) {
      case 'balanced':
        // Select faculty with least load
        return faculties.reduce((prev, curr) => 
          prev.subjects.length <= curr.subjects.length ? prev : curr
        );
      case 'concentrated':
        // Select faculty with most subjects (to concentrate workload)
        return faculties.reduce((prev, curr) => 
          prev.subjects.length >= curr.subjects.length ? prev : curr
        );
      default:
        // Random selection for distributed approach
        return faculties[Math.floor(Math.random() * faculties.length)];
    }
  }

  private getAvailableSlotsWithWorkload(
    day: string, 
    schedule: { [key: string]: { [key: string]: TimeSlot | null } },
    batch: Batch,
    faculty: Faculty,
    facultyDaySlots: TimeSlot[]
  ) {
    const timeSlots = this.getTimeSlots(batch.shift);
    const availableSlots = [];

    for (const slot of timeSlots) {
      const slotKey = `${slot.start}-${slot.end}`;
      
      // Check if slot is free for this batch
      const isSlotFree = !schedule[day][slotKey];
      const isFacultyAvailable = faculty.availability.includes(day);
      
      // Check if faculty is already scheduled at this time (conflict detection)
      const facultyConflict = this.checkFacultyConflict(day, slot, faculty, schedule);
      
      if (isSlotFree && isFacultyAvailable && !facultyConflict) {
        availableSlots.push(slot);
      }
    }

    return availableSlots;
  }

  private checkFacultyConflict(
    day: string,
    slot: { start: string; end: string },
    faculty: Faculty,
    schedule: { [key: string]: { [key: string]: TimeSlot | null } }
  ): boolean {
    // Check all scheduled slots for this day
    const daySchedule = schedule[day];
    for (const timeSlot of Object.values(daySchedule)) {
      if (timeSlot && timeSlot.faculty === faculty.name && timeSlot.type !== 'break') {
        // Check if time slots overlap
        if (this.timeSlotsOverlap(slot, { start: timeSlot.startTime, end: timeSlot.endTime })) {
          return true; // Conflict found
        }
      }
    }
    return false; // No conflict
  }

  private timeSlotsOverlap(
    slot1: { start: string; end: string },
    slot2: { start: string; end: string }
  ): boolean {
    const start1 = this.timeToMinutes(slot1.start);
    const end1 = this.timeToMinutes(slot1.end);
    const start2 = this.timeToMinutes(slot2.start);
    const end2 = this.timeToMinutes(slot2.end);

    return start1 < end2 && start2 < end1;
  }
}