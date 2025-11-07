import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  CheckCircle, 
  X, 
  Eye, 
  Clock, 
  Calendar,
  User,
  MessageCircle
} from 'lucide-react';
import { useAppContext, Timetable } from '../../App';
import { TimetableView } from '../timetable/TimetableView';
import { toast } from 'sonner';

export function PendingApprovals() {
  const { 
    currentUser,
    timetables, 
    setTimetables, 
    selectedDepartment, 
    selectedShift 
  } = useAppContext();

  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [comments, setComments] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  const pendingTimetables = timetables.filter(t => 
    t.status === 'pending' && 
    t.department === selectedDepartment && 
    t.shift === selectedShift
  );

  const handleApprove = (timetable: Timetable) => {
    const updatedTimetables = timetables.map(t => 
      t.id === timetable.id 
        ? { 
            ...t, 
            status: 'approved' as const,
            approvedBy: currentUser?.name || 'HOD',
            approvedAt: new Date().toISOString(),
            comments: comments || undefined
          }
        : t
    );
    setTimetables(updatedTimetables);
    setComments('');
    setShowDialog(false);
    toast.success('Timetable approved successfully');
  };

  const handleReject = (timetable: Timetable) => {
    const updatedTimetables = timetables.map(t => 
      t.id === timetable.id 
        ? { 
            ...t, 
            status: 'rejected' as const,
            comments: comments || 'Rejected by HOD'
          }
        : t
    );
    setTimetables(updatedTimetables);
    setComments('');
    setShowDialog(false);
    toast.success('Timetable rejected');
  };

  const openApprovalDialog = (timetable: Timetable, action: 'approve' | 'reject') => {
    setSelectedTimetable(timetable);
    setActionType(action);
    setComments('');
    setShowDialog(true);
  };

  const getTimetableStats = (timetable: Timetable) => {
    const totalSlots = timetable.slots.length;
    const classSlots = timetable.slots.filter(s => s.type !== 'break').length;
    const uniqueFaculties = new Set(timetable.slots.filter(s => s.type !== 'break').map(s => s.faculty)).size;
    const uniqueClassrooms = new Set(timetable.slots.filter(s => s.type !== 'break').map(s => s.classroom)).size;
    
    return {
      totalSlots,
      classSlots,
      uniqueFaculties,
      uniqueClassrooms
    };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-600">
          Review and approve timetables for {selectedDepartment} Department - {selectedShift} shift
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{pendingTimetables.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Review Time</p>
                <p className="text-2xl font-bold text-gray-900">2.5h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Priority Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingTimetables.filter(t => {
                    const createdDate = new Date(t.createdAt);
                    const now = new Date();
                    const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
                    return hoursDiff > 24; // More than 24 hours old
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Timetables List */}
      <Card>
        <CardHeader>
          <CardTitle>Timetables Awaiting Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pendingTimetables.map((timetable) => {
              const stats = getTimetableStats(timetable);
              const createdDate = new Date(timetable.createdAt);
              const now = new Date();
              const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
              const isUrgent = hoursDiff > 24;

              return (
                <div key={timetable.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{timetable.name}</h3>
                        <Badge variant="secondary">Pending</Badge>
                        {isUrgent && <Badge variant="destructive">Urgent</Badge>}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Created by {timetable.createdBy}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {createdDate.toLocaleDateString()} at {createdDate.toLocaleTimeString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {Math.round(hoursDiff)}h ago
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timetable Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-semibold">{stats.classSlots}</p>
                      <p className="text-xs text-gray-600">Total Classes</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-semibold">{stats.uniqueFaculties}</p>
                      <p className="text-xs text-gray-600">Faculties</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-semibold">{stats.uniqueClassrooms}</p>
                      <p className="text-xs text-gray-600">Classrooms</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-semibold">6</p>
                      <p className="text-xs text-gray-600">Working Days</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{timetable.name} - Preview</DialogTitle>
                        </DialogHeader>
                        <TimetableView timetable={timetable} showWatermark={false} />
                      </DialogContent>
                    </Dialog>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openApprovalDialog(timetable, 'reject')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openApprovalDialog(timetable, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {pendingTimetables.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p>No timetables pending approval at this time.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Timetable' : 'Reject Timetable'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                You are about to {actionType} "{selectedTimetable?.name}".
              </p>
              {actionType === 'approve' && (
                <p className="text-sm text-green-600">
                  Once approved, this timetable will be active and visible to all users.
                </p>
              )}
              {actionType === 'reject' && (
                <p className="text-sm text-red-600">
                  Please provide feedback to help improve the timetable.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {actionType === 'approve' ? 'Comments (Optional)' : 'Rejection Reason *'}
              </label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={
                  actionType === 'approve' 
                    ? 'Add any comments or notes...'
                    : 'Please explain why this timetable is being rejected...'
                }
                rows={3}
                required={actionType === 'reject'}
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (actionType === 'reject' && !comments.trim()) {
                    toast.error('Please provide a reason for rejection');
                    return;
                  }
                  if (actionType === 'approve') {
                    handleApprove(selectedTimetable!);
                  } else {
                    handleReject(selectedTimetable!);
                  }
                }}
                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {actionType === 'approve' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}