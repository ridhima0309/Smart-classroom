import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Clock, 
  Send, 
  Edit, 
  CheckCircle, 
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { useAppContext } from '../../App';
import { toast } from 'sonner';

interface ChangeRequest {
  id: string;
  type: 'reschedule' | 'substitute' | 'cancel' | 'room_change';
  subject: string;
  originalTime: string;
  originalDate: string;
  requestedTime?: string;
  requestedDate?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminComments?: string;
}

export function ChangeRequests() {
  const { currentUser } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState<ChangeRequest[]>([
    {
      id: '1',
      type: 'reschedule',
      subject: 'Data Structures',
      originalTime: '10:00 - 11:00',
      originalDate: '2024-01-15',
      requestedTime: '14:00 - 15:00',
      requestedDate: '2024-01-15',
      reason: 'Medical appointment conflict',
      status: 'pending',
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      type: 'substitute',
      subject: 'Database Management',
      originalTime: '11:00 - 12:00',
      originalDate: '2024-01-12',
      reason: 'Personal emergency',
      status: 'approved',
      createdAt: '2024-01-08T15:30:00Z',
      adminComments: 'Dr. Smith will substitute'
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'reschedule',
    subject: '',
    originalTime: '',
    originalDate: '',
    requestedTime: '',
    requestedDate: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: ChangeRequest = {
      id: Date.now().toString(),
      type: formData.type as ChangeRequest['type'],
      subject: formData.subject,
      originalTime: formData.originalTime,
      originalDate: formData.originalDate,
      requestedTime: formData.requestedTime || undefined,
      requestedDate: formData.requestedDate || undefined,
      reason: formData.reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setRequests([newRequest, ...requests]);
    setFormData({
      type: 'reschedule',
      subject: '',
      originalTime: '',
      originalDate: '',
      requestedTime: '',
      requestedDate: '',
      reason: ''
    });
    setShowForm(false);
    toast.success('Change request submitted successfully');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'reschedule':
        return 'Reschedule Class';
      case 'substitute':
        return 'Request Substitute';
      case 'cancel':
        return 'Cancel Class';
      case 'room_change':
        return 'Room Change';
      default:
        return type;
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Change Requests</h1>
          <p className="text-gray-600">Submit and track your timetable change requests</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedRequests}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Request Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit New Change Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Request Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reschedule">Reschedule Class</SelectItem>
                      <SelectItem value="substitute">Request Substitute</SelectItem>
                      <SelectItem value="cancel">Cancel Class</SelectItem>
                      <SelectItem value="room_change">Room Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Enter subject name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="originalDate">Original Date</Label>
                  <Input
                    id="originalDate"
                    type="date"
                    value={formData.originalDate}
                    onChange={(e) => setFormData({ ...formData, originalDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="originalTime">Original Time</Label>
                  <Input
                    id="originalTime"
                    value={formData.originalTime}
                    onChange={(e) => setFormData({ ...formData, originalTime: e.target.value })}
                    placeholder="e.g., 10:00 - 11:00"
                    required
                  />
                </div>
              </div>

              {formData.type === 'reschedule' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="requestedDate">Requested Date</Label>
                    <Input
                      id="requestedDate"
                      type="date"
                      value={formData.requestedDate}
                      onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="requestedTime">Requested Time</Label>
                    <Input
                      id="requestedTime"
                      value={formData.requestedTime}
                      onChange={(e) => setFormData({ ...formData, requestedTime: e.target.value })}
                      placeholder="e.g., 14:00 - 15:00"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="reason">Reason for Request</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Please provide a detailed reason for your request"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center space-x-3">
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Requests ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <h3 className="font-medium">{getTypeLabel(request.type)}</h3>
                      <p className="text-sm text-gray-600">{request.subject}</p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Original Schedule</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(request.originalDate).toLocaleDateString()} • {request.originalTime}
                    </div>
                  </div>

                  {request.requestedDate && request.requestedTime && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Requested Schedule</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(request.requestedDate).toLocaleDateString()} • {request.requestedTime}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700">Reason</p>
                  <p className="text-sm text-gray-600">{request.reason}</p>
                </div>

                {request.adminComments && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Admin Comments</p>
                    <p className="text-sm text-blue-800">{request.adminComments}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Submitted on {new Date(request.createdAt).toLocaleDateString()}</span>
                  {request.status === 'pending' && (
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No change requests submitted yet</p>
                <p className="text-sm">Click "New Request" to submit your first request</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}