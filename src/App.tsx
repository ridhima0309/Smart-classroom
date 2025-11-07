import React, { useState, createContext, useContext } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { HODDashboard } from './components/HODDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { Toaster } from './components/ui/sonner';

export type UserRole = 'admin' | 'faculty' | 'hod' | 'student' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
}

export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  faculty: string;
  classroom: string;
  batch: string;
  type: 'lecture' | 'lab' | 'break';
  duration: number; // in minutes
}

export interface Timetable {
  id: string;
  name: string;
  department: string;
  shift: 'morning' | 'evening';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  slots: TimeSlot[];
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  weeklyHours: number;
  type: 'theory' | 'lab' | 'elective';
  duration: number; // in minutes
  department: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  subjects: string[];
  assignedClasses: string[]; // Which classes/batches this faculty teaches
  availability: string[];
  avgLeavesPerMonth: number;
  isOnLeave?: boolean;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: 'lecture' | 'lab';
  availability: string[];
}

export interface Batch {
  id: string;
  name: string;
  department: string;
  level: 'UG' | 'PG';
  shift: 'morning' | 'evening';
  strength: number;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  faculties: Faculty[];
  setFaculties: (faculties: Faculty[]) => void;
  classrooms: Classroom[];
  setClassrooms: (classrooms: Classroom[]) => void;
  batches: Batch[];
  setBatches: (batches: Batch[]) => void;
  timetables: Timetable[];
  setTimetables: (timetables: Timetable[]) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedShift: 'morning' | 'evening';
  setSelectedShift: (shift: 'morning' | 'evening') => void;
  lunchBreakDuration: number;
  setLunchBreakDuration: (duration: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Initialize with expanded dummy data
  const [subjects, setSubjects] = useState<Subject[]>([
    // First Year Subjects
    {
      id: 'CSE101',
      name: 'Programming Fundamentals',
      code: 'CSE101',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE101L',
      name: 'Programming Fundamentals Lab',
      code: 'CSE101L',
      weeklyHours: 2,
      type: 'lab',
      duration: 120,
      department: 'CSE'
    },
    {
      id: 'CSE102',
      name: 'Digital Logic Design',
      code: 'CSE102',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE102L',
      name: 'Digital Logic Design Lab',
      code: 'CSE102L',
      weeklyHours: 2,
      type: 'lab',
      duration: 120,
      department: 'CSE'
    },
    {
      id: 'MATH101',
      name: 'Engineering Mathematics I',
      code: 'MATH101',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'PHY101',
      name: 'Engineering Physics',
      code: 'PHY101',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    // Second Year Subjects
    {
      id: 'CSE201',
      name: 'Data Structures',
      code: 'CSE201',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE201L',
      name: 'Data Structures Lab',
      code: 'CSE201L',
      weeklyHours: 2,
      type: 'lab',
      duration: 120,
      department: 'CSE'
    },
    {
      id: 'CSE202',
      name: 'Computer Organization',
      code: 'CSE202',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE203',
      name: 'Discrete Mathematics',
      code: 'CSE203',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE204',
      name: 'Object Oriented Programming',
      code: 'CSE204',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE204L',
      name: 'Object Oriented Programming Lab',
      code: 'CSE204L',
      weeklyHours: 2,
      type: 'lab',
      duration: 120,
      department: 'CSE'
    },
    // Third Year Subjects
    {
      id: 'CSE301',
      name: 'Database Management Systems',
      code: 'CSE301',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE301L',
      name: 'Database Management Systems Lab',
      code: 'CSE301L',
      weeklyHours: 2,
      type: 'lab',
      duration: 120,
      department: 'CSE'
    },
    {
      id: 'CSE302',
      name: 'Operating Systems',
      code: 'CSE302',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE303',
      name: 'Computer Networks',
      code: 'CSE303',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE304',
      name: 'Software Engineering',
      code: 'CSE304',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE305',
      name: 'Web Technologies',
      code: 'CSE305',
      weeklyHours: 2,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE305L',
      name: 'Web Technologies Lab',
      code: 'CSE305L',
      weeklyHours: 2,
      type: 'lab',
      duration: 120,
      department: 'CSE'
    },
    // Fourth Year Subjects
    {
      id: 'CSE401',
      name: 'Artificial Intelligence',
      code: 'CSE401',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE402',
      name: 'Machine Learning',
      code: 'CSE402',
      weeklyHours: 3,
      type: 'elective',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE403',
      name: 'Distributed Systems',
      code: 'CSE403',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE404',
      name: 'Cyber Security',
      code: 'CSE404',
      weeklyHours: 3,
      type: 'elective',
      duration: 60,
      department: 'CSE'
    },
    {
      id: 'CSE405',
      name: 'Project Management',
      code: 'CSE405',
      weeklyHours: 2,
      type: 'theory',
      duration: 60,
      department: 'CSE'
    },
    // ECE Department Subjects
    {
      id: 'ECE101',
      name: 'Circuit Analysis',
      code: 'ECE101',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'ECE'
    },
    {
      id: 'ECE101L',
      name: 'Circuit Analysis Lab',
      code: 'ECE101L',
      weeklyHours: 2,
      type: 'lab',
      duration: 120,
      department: 'ECE'
    },
    {
      id: 'ECE102',
      name: 'Digital Electronics',
      code: 'ECE102',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'ECE'
    },
    {
      id: 'ECE102L',
      name: 'Digital Electronics Lab',
      code: 'ECE102L',
      weeklyHours: 2,
      type: 'lab',
      duration: 120,
      department: 'ECE'
    },
    {
      id: 'ECE103',
      name: 'Electromagnetic Theory',
      code: 'ECE103',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'ECE'
    },
    {
      id: 'ECE201',
      name: 'Signal Processing',
      code: 'ECE201',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'ECE'
    },
    {
      id: 'ECE202',
      name: 'Communication Systems',
      code: 'ECE202',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'ECE'
    },
    {
      id: 'ECE203',
      name: 'Control Systems',
      code: 'ECE203',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'ECE'
    },
    {
      id: 'ECE301',
      name: 'Microprocessors',
      code: 'ECE301',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'ECE'
    },
    {
      id: 'ECE302',
      name: 'VLSI Design',
      code: 'ECE302',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'ECE'
    },
    // MECH Department Subjects
    {
      id: 'MECH101',
      name: 'Engineering Mechanics',
      code: 'MECH101',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'MECH'
    },
    {
      id: 'MECH101L',
      name: 'Engineering Mechanics Lab',
      code: 'MECH101L',
      weeklyHours: 2,
      type: 'lab',
      duration: 120,
      department: 'MECH'
    },
    {
      id: 'MECH102',
      name: 'Thermodynamics',
      code: 'MECH102',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'MECH'
    },
    {
      id: 'MECH103',
      name: 'Material Science',
      code: 'MECH103',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'MECH'
    },
    {
      id: 'MECH201',
      name: 'Fluid Mechanics',
      code: 'MECH201',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'MECH'
    },
    {
      id: 'MECH202',
      name: 'Machine Design',
      code: 'MECH202',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'MECH'
    },
    {
      id: 'MECH301',
      name: 'Heat Transfer',
      code: 'MECH301',
      weeklyHours: 3,
      type: 'theory',
      duration: 60,
      department: 'MECH'
    },
    {
      id: 'MECH302',
      name: 'Manufacturing Processes',
      code: 'MECH302',
      weeklyHours: 4,
      type: 'theory',
      duration: 60,
      department: 'MECH'
    }
  ]);
  
  const [faculties, setFaculties] = useState<Faculty[]>([
    // Physics Faculty (8-10 teachers for PHY101)
    {
      id: 'F001',
      name: 'Dr. Rajesh Agarwal',
      department: 'CSE',
      subjects: ['PHY101'],
      assignedClasses: ['CSE-1A', 'CSE-1B', 'ECE-1A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F002',
      name: 'Prof. Sunita Gupta',
      department: 'CSE',
      subjects: ['PHY101'],
      assignedClasses: ['CSE-1C', 'CSE-2A', 'ECE-1B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },
    {
      id: 'F003',
      name: 'Dr. Vikram Patel',
      department: 'CSE',
      subjects: ['PHY101'],
      assignedClasses: ['CSE-2B', 'CSE-2C', 'ECE-1C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F004',
      name: 'Prof. Meera Sharma',
      department: 'CSE',
      subjects: ['PHY101'],
      assignedClasses: ['MECH-1A', 'MECH-1B', 'MECH-1C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },
    {
      id: 'F005',
      name: 'Dr. Amit Kumar',
      department: 'CSE',
      subjects: ['PHY101'],
      assignedClasses: ['MECH-2A', 'MECH-2B', 'ECE-2A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F006',
      name: 'Prof. Kavita Singh',
      department: 'CSE',
      subjects: ['PHY101'],
      assignedClasses: ['ECE-2B', 'ECE-3A', 'MECH-3A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F007',
      name: 'Dr. Ravi Nair',
      department: 'CSE',
      subjects: ['PHY101'],
      assignedClasses: ['ECE-3B', 'MECH-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },
    {
      id: 'F008',
      name: 'Prof. Priya Desai',
      department: 'CSE',
      subjects: ['PHY101'],
      assignedClasses: ['CSE-3A', 'CSE-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F009',
      name: 'Dr. Manoj Verma',
      department: 'CSE',
      subjects: ['PHY101'],
      assignedClasses: ['CSE-3C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },

    // Mathematics Faculty (6-7 teachers for MATH101)
    {
      id: 'F010',
      name: 'Dr. Anjali Mehta',
      department: 'CSE',
      subjects: ['MATH101'],
      assignedClasses: ['CSE-1A', 'CSE-1B', 'CSE-2A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F011',
      name: 'Prof. Sanjay Joshi',
      department: 'CSE',
      subjects: ['MATH101'],
      assignedClasses: ['CSE-1C', 'CSE-2B', 'CSE-2C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F012',
      name: 'Dr. Pooja Agarwal',
      department: 'CSE',
      subjects: ['MATH101'],
      assignedClasses: ['ECE-1A', 'ECE-1B', 'ECE-1C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },
    {
      id: 'F013',
      name: 'Prof. Deepak Shah',
      department: 'CSE',
      subjects: ['MATH101'],
      assignedClasses: ['ECE-2A', 'ECE-2B', 'MECH-1A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },
    {
      id: 'F014',
      name: 'Dr. Neha Kulkarni',
      department: 'CSE',
      subjects: ['MATH101'],
      assignedClasses: ['MECH-1B', 'MECH-1C', 'MECH-2A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F015',
      name: 'Prof. Rahul Thakur',
      department: 'CSE',
      subjects: ['MATH101'],
      assignedClasses: ['MECH-2B', 'MECH-3A', 'MECH-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },

    // Programming Fundamentals Faculty (5-6 teachers)
    {
      id: 'F016',
      name: 'Dr. Rakesh Sharma',
      department: 'CSE',
      subjects: ['CSE101', 'CSE101L'],
      assignedClasses: ['CSE-1A', 'CSE-1B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F017',
      name: 'Prof. Nisha Kapoor',
      department: 'CSE',
      subjects: ['CSE101', 'CSE101L'],
      assignedClasses: ['CSE-1C', 'CSE-2A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F018',
      name: 'Dr. Arjun Rao',
      department: 'CSE',
      subjects: ['CSE101', 'CSE101L'],
      assignedClasses: ['CSE-2B', 'CSE-2C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },
    {
      id: 'F019',
      name: 'Prof. Seema Patel',
      department: 'CSE',
      subjects: ['CSE101', 'CSE101L'],
      assignedClasses: ['CSE-3A', 'CSE-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },
    {
      id: 'F020',
      name: 'Dr. Kiran Desai',
      department: 'CSE',
      subjects: ['CSE101', 'CSE101L'],
      assignedClasses: ['CSE-3C', 'CSE-4A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },

    // Digital Logic Design Faculty (4-5 teachers)
    {
      id: 'F021',
      name: 'Prof. Suresh Verma',
      department: 'CSE',
      subjects: ['CSE102', 'CSE102L'],
      assignedClasses: ['CSE-1A', 'CSE-1B', 'CSE-1C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F022',
      name: 'Dr. Madhuri Singh',
      department: 'CSE',
      subjects: ['CSE102', 'CSE102L'],
      assignedClasses: ['CSE-2A', 'CSE-2B', 'CSE-2C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },
    {
      id: 'F023',
      name: 'Prof. Vinod Kumar',
      department: 'CSE',
      subjects: ['CSE102', 'CSE102L'],
      assignedClasses: ['CSE-3A', 'CSE-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },
    {
      id: 'F024',
      name: 'Dr. Ritu Agarwal',
      department: 'CSE',
      subjects: ['CSE102', 'CSE102L'],
      assignedClasses: ['CSE-3C', 'CSE-4A', 'CSE-4B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },

    // Data Structures Faculty (4-5 teachers)
    {
      id: 'F025',
      name: 'Dr. Vikash Jain',
      department: 'CSE',
      subjects: ['CSE201', 'CSE201L'],
      assignedClasses: ['CSE-2A', 'CSE-2B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F026',
      name: 'Prof. Sushma Rao',
      department: 'CSE',
      subjects: ['CSE201', 'CSE201L'],
      assignedClasses: ['CSE-2C', 'CSE-3A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F027',
      name: 'Dr. Ashish Gupta',
      department: 'CSE',
      subjects: ['CSE201', 'CSE201L'],
      assignedClasses: ['CSE-3B', 'CSE-3C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },
    {
      id: 'F028',
      name: 'Prof. Geeta Sharma',
      department: 'CSE',
      subjects: ['CSE201', 'CSE201L'],
      assignedClasses: ['CSE-4A', 'CSE-4B', 'CSE-4C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },

    // Database Management Systems Faculty (3-4 teachers)
    {
      id: 'F029',
      name: 'Dr. Rajiv Nair',
      department: 'CSE',
      subjects: ['CSE301', 'CSE301L'],
      assignedClasses: ['CSE-3A', 'CSE-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F030',
      name: 'Prof. Swati Kulkarni',
      department: 'CSE',
      subjects: ['CSE301', 'CSE301L'],
      assignedClasses: ['CSE-3C', 'CSE-4A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F031',
      name: 'Dr. Pramod Shah',
      department: 'CSE',
      subjects: ['CSE301', 'CSE301L'],
      assignedClasses: ['CSE-4B', 'CSE-4C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },

    // Operating Systems Faculty (3-4 teachers)
    {
      id: 'F032',
      name: 'Prof. Nitin Agarwal',
      department: 'CSE',
      subjects: ['CSE302'],
      assignedClasses: ['CSE-3A', 'CSE-3B', 'CSE-3C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F033',
      name: 'Dr. Rekha Patel',
      department: 'CSE',
      subjects: ['CSE302'],
      assignedClasses: ['CSE-4A', 'CSE-4B', 'CSE-4C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },

    // Computer Networks Faculty (3 teachers)
    {
      id: 'F034',
      name: 'Dr. Sachin Joshi',
      department: 'CSE',
      subjects: ['CSE303'],
      assignedClasses: ['CSE-3A', 'CSE-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F035',
      name: 'Prof. Lata Singh',
      department: 'CSE',
      subjects: ['CSE303'],
      assignedClasses: ['CSE-3C', 'CSE-4A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F036',
      name: 'Dr. Manish Kumar',
      department: 'CSE',
      subjects: ['CSE303'],
      assignedClasses: ['CSE-4B', 'CSE-4C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },

    // Final Year Subjects Faculty
    {
      id: 'F037',
      name: 'Prof. Rajesh Kumar',
      department: 'CSE',
      subjects: ['CSE401', 'CSE402'],
      assignedClasses: ['CSE-4A', 'CSE-4B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F038',
      name: 'Dr. Suman Gupta',
      department: 'CSE',
      subjects: ['CSE403', 'CSE404'],
      assignedClasses: ['CSE-4A', 'CSE-4B', 'CSE-4C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },
    {
      id: 'F039',
      name: 'Prof. Vikram Singh',
      department: 'CSE',
      subjects: ['CSE405'],
      assignedClasses: ['CSE-4A', 'CSE-4B', 'CSE-4C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },

    // Missing Second Year Subjects Faculty - Adding these to fix the errors
    
    // Computer Organization Faculty (3-4 teachers for CSE202)
    {
      id: 'F055',
      name: 'Dr. Sudhir Agarwal',
      department: 'CSE',
      subjects: ['CSE202'],
      assignedClasses: ['CSE-2A', 'CSE-2B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F056',
      name: 'Prof. Rashmi Patel',
      department: 'CSE',
      subjects: ['CSE202'],
      assignedClasses: ['CSE-2C', 'CSE-3A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },
    {
      id: 'F057',
      name: 'Dr. Vijay Kumar',
      department: 'CSE',
      subjects: ['CSE202'],
      assignedClasses: ['CSE-3B', 'CSE-3C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },

    // Discrete Mathematics Faculty (3-4 teachers for CSE203)
    {
      id: 'F058',
      name: 'Dr. Padmini Shah',
      department: 'CSE',
      subjects: ['CSE203'],
      assignedClasses: ['CSE-2A', 'CSE-2B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F059',
      name: 'Prof. Harish Verma',
      department: 'CSE',
      subjects: ['CSE203'],
      assignedClasses: ['CSE-2C', 'CSE-3A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },
    {
      id: 'F060',
      name: 'Dr. Sudha Kulkarni',
      department: 'CSE',
      subjects: ['CSE203'],
      assignedClasses: ['CSE-3B', 'CSE-3C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },

    // Object Oriented Programming Faculty (4-5 teachers for CSE204 & CSE204L)
    {
      id: 'F061',
      name: 'Prof. Anand Joshi',
      department: 'CSE',
      subjects: ['CSE204', 'CSE204L'],
      assignedClasses: ['CSE-2A', 'CSE-2B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F062',
      name: 'Dr. Meera Reddy',
      department: 'CSE',
      subjects: ['CSE204', 'CSE204L'],
      assignedClasses: ['CSE-2C', 'CSE-3A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F063',
      name: 'Prof. Rohit Gupta',
      department: 'CSE',
      subjects: ['CSE204', 'CSE204L'],
      assignedClasses: ['CSE-3B', 'CSE-3C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },
    {
      id: 'F064',
      name: 'Dr. Nidhi Sharma',
      department: 'CSE',
      subjects: ['CSE204', 'CSE204L'],
      assignedClasses: ['CSE-4A', 'CSE-4B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },

    // Software Engineering Faculty (3 teachers for CSE304)
    {
      id: 'F065',
      name: 'Dr. Ramesh Tiwari',
      department: 'CSE',
      subjects: ['CSE304'],
      assignedClasses: ['CSE-3A', 'CSE-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F066',
      name: 'Prof. Smita Agarwal',
      department: 'CSE',
      subjects: ['CSE304'],
      assignedClasses: ['CSE-3C', 'CSE-4A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F067',
      name: 'Dr. Ashok Kumar',
      department: 'CSE',
      subjects: ['CSE304'],
      assignedClasses: ['CSE-4B', 'CSE-4C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },

    // Web Technologies Faculty (3-4 teachers for CSE305 & CSE305L)
    {
      id: 'F068',
      name: 'Prof. Pradeep Singh',
      department: 'CSE',
      subjects: ['CSE305', 'CSE305L'],
      assignedClasses: ['CSE-3A', 'CSE-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F069',
      name: 'Dr. Kavitha Reddy',
      department: 'CSE',
      subjects: ['CSE305', 'CSE305L'],
      assignedClasses: ['CSE-3C', 'CSE-4A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F070',
      name: 'Prof. Dinesh Yadav',
      department: 'CSE',
      subjects: ['CSE305', 'CSE305L'],
      assignedClasses: ['CSE-4B', 'CSE-4C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },

    // ECE Faculty - 15+ faculty members
    {
      id: 'F040',
      name: 'Dr. Ravi Patel',
      department: 'ECE',
      subjects: ['ECE101', 'ECE101L'],
      assignedClasses: ['ECE-1A', 'ECE-1B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F041',
      name: 'Prof. Meera Joshi',
      department: 'ECE',
      subjects: ['ECE102', 'ECE102L'],
      assignedClasses: ['ECE-1A', 'ECE-1B', 'ECE-1C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },
    {
      id: 'F042',
      name: 'Dr. Sunil Reddy',
      department: 'ECE',
      subjects: ['ECE103', 'ECE201'],
      assignedClasses: ['ECE-1C', 'ECE-2A', 'ECE-2B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F043',
      name: 'Prof. Anita Kapoor',
      department: 'ECE',
      subjects: ['ECE202', 'ECE203'],
      assignedClasses: ['ECE-2A', 'ECE-2B', 'ECE-3A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F044',
      name: 'Dr. Rajiv Malhotra',
      department: 'ECE',
      subjects: ['ECE301', 'ECE302'],
      assignedClasses: ['ECE-3A', 'ECE-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },
    {
      id: 'F045',
      name: 'Prof. Sunita Yadav',
      department: 'ECE',
      subjects: ['ECE101', 'ECE101L'],
      assignedClasses: ['ECE-1C', 'ECE-2A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F046',
      name: 'Dr. Anil Tiwari',
      department: 'ECE',
      subjects: ['ECE102', 'ECE102L'],
      assignedClasses: ['ECE-2B', 'ECE-3A', 'ECE-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },

    // MECH Faculty - 15+ faculty members  
    {
      id: 'F047',
      name: 'Dr. Arjun Kumar',
      department: 'MECH',
      subjects: ['MECH101', 'MECH101L'],
      assignedClasses: ['MECH-1A', 'MECH-1B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F048',
      name: 'Prof. Sunita Rao',
      department: 'MECH',
      subjects: ['MECH102', 'MECH103'],
      assignedClasses: ['MECH-1A', 'MECH-1B', 'MECH-1C'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F049',
      name: 'Dr. Ramesh Desai',
      department: 'MECH',
      subjects: ['MECH201', 'MECH202'],
      assignedClasses: ['MECH-2A', 'MECH-2B', 'MECH-3A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F050',
      name: 'Prof. Manoj Agarwal',
      department: 'MECH',
      subjects: ['MECH301', 'MECH302'],
      assignedClasses: ['MECH-3A', 'MECH-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    },
    {
      id: 'F051',
      name: 'Dr. Pooja Sharma',
      department: 'MECH',
      subjects: ['MECH101', 'MECH101L'],
      assignedClasses: ['MECH-1C', 'MECH-2A'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F052',
      name: 'Prof. Deepak Jain',
      department: 'MECH',
      subjects: ['MECH102', 'MECH103'],
      assignedClasses: ['MECH-2B', 'MECH-3A', 'MECH-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 1,
      isOnLeave: false
    },
    {
      id: 'F053',
      name: 'Dr. Swati Kulkarni',
      department: 'MECH',
      subjects: ['MECH201', 'MECH202'],
      assignedClasses: ['MECH-2A', 'MECH-2B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 0,
      isOnLeave: false
    },
    {
      id: 'F054',
      name: 'Prof. Ajay Thakur',
      department: 'MECH',
      subjects: ['MECH301', 'MECH302'],
      assignedClasses: ['MECH-3A', 'MECH-3B'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      avgLeavesPerMonth: 2,
      isOnLeave: false
    }
  ]);
  
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    // Lecture Halls
    {
      id: 'CR101',
      name: 'CR101',
      capacity: 60,
      type: 'lecture',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 'CR102',
      name: 'CR102',
      capacity: 60,
      type: 'lecture',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 'CR103',
      name: 'CR103',
      capacity: 65,
      type: 'lecture',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 'CR104',
      name: 'CR104',
      capacity: 65,
      type: 'lecture',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 'CR105',
      name: 'CR105',
      capacity: 70,
      type: 'lecture',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 'CR106',
      name: 'CR106',
      capacity: 70,
      type: 'lecture',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    // Computer Labs
    {
      id: 'LAB201',
      name: 'Computer Lab 1',
      capacity: 30,
      type: 'lab',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 'LAB202',
      name: 'Computer Lab 2',
      capacity: 30,
      type: 'lab',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 'LAB203',
      name: 'Computer Lab 3',
      capacity: 35,
      type: 'lab',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 'LAB204',
      name: 'Computer Lab 4',
      capacity: 35,
      type: 'lab',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    // Special Rooms
    {
      id: 'CR301',
      name: 'Seminar Hall',
      capacity: 120,
      type: 'lecture',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 'CR302',
      name: 'Smart Classroom',
      capacity: 80,
      type: 'lecture',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  ]);
  
  const [batches, setBatches] = useState<Batch[]>([
    // First Year
    {
      id: 'CSE-1A',
      name: 'CSE 1A (Semester 1)',
      department: 'CSE',
      level: 'UG',
      shift: 'morning',
      strength: 60
    },
    {
      id: 'CSE-1B',
      name: 'CSE 1B (Semester 1)',
      department: 'CSE',
      level: 'UG',
      shift: 'morning',
      strength: 58
    },
    {
      id: 'CSE-1C',
      name: 'CSE 1C (Semester 2)',
      department: 'CSE',
      level: 'UG',
      shift: 'evening',
      strength: 55
    },
    // Second Year
    {
      id: 'CSE-2A',
      name: 'CSE 2A (Semester 3)',
      department: 'CSE',
      level: 'UG',
      shift: 'morning',
      strength: 62
    },
    {
      id: 'CSE-2B',
      name: 'CSE 2B (Semester 3)',
      department: 'CSE',
      level: 'UG',
      shift: 'morning',
      strength: 59
    },
    {
      id: 'CSE-2C',
      name: 'CSE 2C (Semester 4)',
      department: 'CSE',
      level: 'UG',
      shift: 'evening',
      strength: 57
    },
    // Third Year
    {
      id: 'CSE-3A',
      name: 'CSE 3A (Semester 5)',
      department: 'CSE',
      level: 'UG',
      shift: 'morning',
      strength: 55
    },
    {
      id: 'CSE-3B',
      name: 'CSE 3B (Semester 5)',
      department: 'CSE',
      level: 'UG',
      shift: 'morning',
      strength: 53
    },
    {
      id: 'CSE-3C',
      name: 'CSE 3C (Semester 6)',
      department: 'CSE',
      level: 'UG',
      shift: 'evening',
      strength: 52
    },
    // Fourth Year
    {
      id: 'CSE-4A',
      name: 'CSE 4A (Semester 7)',
      department: 'CSE',
      level: 'UG',
      shift: 'morning',
      strength: 50
    },
    {
      id: 'CSE-4B',
      name: 'CSE 4B (Semester 7)',
      department: 'CSE',
      level: 'UG',
      shift: 'morning',
      strength: 48
    },
    {
      id: 'CSE-4C',
      name: 'CSE 4C (Semester 8)',
      department: 'CSE',
      level: 'UG',
      shift: 'evening',
      strength: 45
    },
    // ECE Classes
    {
      id: 'ECE-1A',
      name: 'ECE 1A (Semester 1)',
      department: 'ECE',
      level: 'UG',
      shift: 'morning',
      strength: 55
    },
    {
      id: 'ECE-1B',
      name: 'ECE 1B (Semester 1)',
      department: 'ECE',
      level: 'UG',
      shift: 'evening',
      strength: 52
    },
    {
      id: 'ECE-1C',
      name: 'ECE 1C (Semester 2)',
      department: 'ECE',
      level: 'UG',
      shift: 'morning',
      strength: 58
    },
    {
      id: 'ECE-2A',
      name: 'ECE 2A (Semester 3)',
      department: 'ECE',
      level: 'UG',
      shift: 'morning',
      strength: 56
    },
    {
      id: 'ECE-2B',
      name: 'ECE 2B (Semester 4)',
      department: 'ECE',
      level: 'UG',
      shift: 'evening',
      strength: 54
    },
    {
      id: 'ECE-3A',
      name: 'ECE 3A (Semester 5)',
      department: 'ECE',
      level: 'UG',
      shift: 'morning',
      strength: 52
    },
    {
      id: 'ECE-3B',
      name: 'ECE 3B (Semester 6)',
      department: 'ECE',
      level: 'UG',
      shift: 'evening',
      strength: 50
    },
    // MECH Classes
    {
      id: 'MECH-1A',
      name: 'MECH 1A (Semester 1)',
      department: 'MECH',
      level: 'UG',
      shift: 'morning',
      strength: 62
    },
    {
      id: 'MECH-1B',
      name: 'MECH 1B (Semester 1)',
      department: 'MECH',
      level: 'UG',
      shift: 'evening',
      strength: 60
    },
    {
      id: 'MECH-1C',
      name: 'MECH 1C (Semester 2)',
      department: 'MECH',
      level: 'UG',
      shift: 'morning',
      strength: 58
    },
    {
      id: 'MECH-2A',
      name: 'MECH 2A (Semester 3)',
      department: 'MECH',
      level: 'UG',
      shift: 'morning',
      strength: 64
    },
    {
      id: 'MECH-2B',
      name: 'MECH 2B (Semester 4)',
      department: 'MECH',
      level: 'UG',
      shift: 'evening',
      strength: 61
    },
    {
      id: 'MECH-3A',
      name: 'MECH 3A (Semester 5)',
      department: 'MECH',
      level: 'UG',
      shift: 'morning',
      strength: 59
    },
    {
      id: 'MECH-3B',
      name: 'MECH 3B (Semester 6)',
      department: 'MECH',
      level: 'UG',
      shift: 'evening',
      strength: 57
    }
  ]);
  
  // Initialize with empty timetables array - algorithm will generate them
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('CSE');
  const [selectedShift, setSelectedShift] = useState<'morning' | 'evening'>('morning');
  const [lunchBreakDuration, setLunchBreakDuration] = useState(60); // minutes

  const contextValue: AppContextType = {
    currentUser,
    setCurrentUser,
    currentPage,
    setCurrentPage,
    subjects,
    setSubjects,
    faculties,
    setFaculties,
    classrooms,
    setClassrooms,
    batches,
    setBatches,
    timetables,
    setTimetables,
    selectedDepartment,
    setSelectedDepartment,
    selectedShift,
    setSelectedShift,
    lunchBreakDuration,
    setLunchBreakDuration,
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'hod':
        return <HODDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        {renderCurrentPage()}
        <Toaster />
      </div>
    </AppContext.Provider>
  );

  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
  // 🔍 Change this URL to your backend’s actual running address
  fetch("http://localhost:5000/api/health")
    .then(res => res.json())
    .then(data => {
      console.log("✅ Backend response:", data);
      setBackendStatus("✅ Connected to backend");
    })
    .catch(err => {
      console.error("❌ Backend not reachable:", err);
      setBackendStatus("❌ Backend not connected");
    });
}, []);

<div
  style={{
    backgroundColor: backendStatus.includes("✅") ? "#e6ffed" : "#ffe6e6",
    color: backendStatus.includes("✅") ? "#007f00" : "#b30000",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "10px",
    textAlign: "center",
    fontWeight: "500"
  }}
>
  Backend Status: {backendStatus}
</div>


}
