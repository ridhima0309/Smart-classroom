import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useAppContext, UserRole } from '../App';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';

export function LoginPage() {
  const { setCurrentUser, setCurrentPage } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const departments = ['CSE', 'IT', 'Mechanical', 'Civil', 'Electrical', 'ECE'];

  const handleLogin = async () => {
    if (!email || !password || !selectedRole) {
      toast.error('Please fill all fields');
      return;
    }

    if (selectedRole !== 'admin' && !selectedDepartment) {
      toast.error('Please select a department');
      return;
    }

    // Try Supabase authentication first
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message || 'Login failed');
        }

        if (data?.user) {
          const userFromSupabase = data.user;
          const user = {
            id: userFromSupabase.id,
            name: userFromSupabase.email ? userFromSupabase.email.split('@')[0] : userFromSupabase.id,
            role: selectedRole,
            department: selectedRole === 'admin' ? undefined : selectedDepartment,
          };
          setCurrentUser(user);
          setCurrentPage(selectedRole === 'admin' ? 'admin' : selectedRole);
          toast.success(`Welcome, ${user.name}!`);
          return;
        }
      } catch (err: any) {
        console.error('Supabase login error', err);
        toast.error('Login error — see console');
      }
    }

    // If Supabase not available or login failed, keep demo fallback behavior
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      role: selectedRole,
      department: selectedRole === 'admin' ? undefined : selectedDepartment,
    };

    setCurrentUser(user);
    // Navigate to appropriate dashboard
    switch (selectedRole) {
      case 'admin':
        setCurrentPage('admin');
        break;
      case 'faculty':
        setCurrentPage('faculty');
        break;
      case 'hod':
        setCurrentPage('hod');
        break;
      case 'student':
        setCurrentPage('student');
        break;
    }

    toast.success(`Welcome, ${user.name}!`);
  };

  const handleDemoLogin = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(`demo${role}@college.edu`);
    setPassword('demo123');
    if (role !== 'admin') {
      setSelectedDepartment('CSE');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentPage('landing')}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Smart Timetable</h1>
          </div>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole || ''} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="hod">HOD/Principal</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedRole && selectedRole !== 'admin' && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Logins</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('admin')}
              >
                Admin Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('faculty')}
              >
                Faculty Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('hod')}
              >
                HOD Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDemoLogin('student')}
              >
                Student Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}