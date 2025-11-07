import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  CheckCircle, 
  Search, 
  Filter, 
  Eye, 
  Download,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { useAppContext } from '../../App';
import { TimetableView } from '../timetable/TimetableView';
import { toast } from 'sonner';

export function ApprovedTimetables() {
  const { 
    timetables, 
    selectedDepartment, 
    selectedShift 
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const approvedTimetables = timetables.filter(t => 
    t.status === 'approved' && 
    t.department === selectedDepartment && 
    t.shift === selectedShift
  );

  const filteredTimetables = approvedTimetables
    .filter(timetable => 
      timetable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timetable.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.approvedAt || b.createdAt).getTime() - new Date(a.approvedAt || a.createdAt).getTime();
        case 'oldest':
          return new Date(a.approvedAt || a.createdAt).getTime() - new Date(b.approvedAt || b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleExport = (timetable: any) => {
    // Mock export functionality
    toast.success(`${timetable.name} exported successfully`);
  };

  const getTimetableStats = (timetable: any) => {
    const totalSlots = timetable.slots.length;
    const classSlots = timetable.slots.filter((s: any) => s.type !== 'break').length;
    const uniqueFaculties = new Set(timetable.slots.filter((s: any) => s.type !== 'break').map((s: any) => s.faculty)).size;
    const uniqueClassrooms = new Set(timetable.slots.filter((s: any) => s.type !== 'break').map((s: any) => s.classroom)).size;
    
    return {
      totalSlots,
      classSlots,
      uniqueFaculties,
      uniqueClassrooms
    };
  };

  const getTimeSinceApproval = (approvedAt: string) => {
    const approved = new Date(approvedAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - approved.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Yesterday';
    return `${daysDiff} days ago`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approved Timetables</h1>
        <p className="text-gray-600">
          Manage approved timetables for {selectedDepartment} Department - {selectedShift} shift
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedTimetables.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedTimetables.filter(t => {
                    const approved = new Date(t.approvedAt || t.createdAt);
                    const thisMonth = new Date();
                    return approved.getMonth() === thisMonth.getMonth() && 
                           approved.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedTimetables.filter(t => {
                    // Consider timetables approved in the last 30 days as active
                    const approved = new Date(t.approvedAt || t.createdAt);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return approved >= thirtyDaysAgo;
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Classes/Day</p>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedTimetables.length > 0 
                    ? Math.round(
                        approvedTimetables.reduce((sum, t) => 
                          sum + t.slots.filter((s: any) => s.type !== 'break').length, 0
                        ) / (approvedTimetables.length * 6) // 6 working days
                      )
                    : 0}
                </p>
              </div>
              <User className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search approved timetables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approved Timetables List */}
      <Card>
        <CardHeader>
          <CardTitle>Approved Timetables ({filteredTimetables.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredTimetables.map((timetable) => {
              const stats = getTimetableStats(timetable);
              const approvedDate = new Date(timetable.approvedAt || timetable.createdAt);

              return (
                <div key={timetable.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-green-50 border-green-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{timetable.name}</h3>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Created by {timetable.createdBy}
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approved by {timetable.approvedBy}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {getTimeSinceApproval(timetable.approvedAt || timetable.createdAt)}
                        </div>
                      </div>
                      {timetable.comments && (
                        <div className="p-3 bg-blue-50 rounded-lg mb-3">
                          <p className="text-sm text-blue-900">
                            <strong>Approval Comments:</strong> {timetable.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timetable Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="text-lg font-semibold text-green-600">{stats.classSlots}</p>
                      <p className="text-xs text-gray-600">Total Classes</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="text-lg font-semibold text-green-600">{stats.uniqueFaculties}</p>
                      <p className="text-xs text-gray-600">Faculties</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="text-lg font-semibold text-green-600">{stats.uniqueClassrooms}</p>
                      <p className="text-xs text-gray-600">Classrooms</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <p className="text-lg font-semibold text-green-600">6</p>
                      <p className="text-xs text-gray-600">Working Days</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Approved on {approvedDate.toLocaleDateString()} at {approvedDate.toLocaleTimeString()}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{timetable.name} - Approved Timetable</DialogTitle>
                          </DialogHeader>
                          <TimetableView timetable={timetable} />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(timetable)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTimetables.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm ? 'No matching timetables found' : 'No approved timetables yet'}
                </h3>
                <p>
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Approved timetables will appear here once you approve them from the pending list'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}