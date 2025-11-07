import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Send, 
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  Copy
} from 'lucide-react';
import { useAppContext, Timetable } from '../../App';
import { TimetableView } from '../timetable/TimetableView';
import { toast } from 'sonner';

export function TimetableManagement() {
  const { 
    timetables, 
    setTimetables, 
    selectedDepartment, 
    selectedShift 
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  const filteredTimetables = timetables.filter(timetable => {
    const matchesSearch = timetable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timetable.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || timetable.status === statusFilter;
    const matchesDepartment = timetable.department === selectedDepartment;
    const matchesShift = timetable.shift === selectedShift;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesShift;
  });

  const statusCounts = {
    all: filteredTimetables.length,
    draft: filteredTimetables.filter(t => t.status === 'draft').length,
    pending: filteredTimetables.filter(t => t.status === 'pending').length,
    approved: filteredTimetables.filter(t => t.status === 'approved').length,
    rejected: filteredTimetables.filter(t => t.status === 'rejected').length
  };

  const handleSendForApproval = (timetable: Timetable) => {
    const updatedTimetables = timetables.map(t => 
      t.id === timetable.id 
        ? { ...t, status: 'pending' as const }
        : t
    );
    setTimetables(updatedTimetables);
    toast.success('Timetable sent for approval');
  };

  const handleDelete = (timetable: Timetable) => {
    const updatedTimetables = timetables.filter(t => t.id !== timetable.id);
    setTimetables(updatedTimetables);
    toast.success('Timetable deleted');
  };

  const handleDuplicate = (timetable: Timetable) => {
    const duplicatedTimetable: Timetable = {
      ...timetable,
      id: `${timetable.id}-copy-${Date.now()}`,
      name: `${timetable.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      approvedBy: undefined,
      approvedAt: undefined,
      comments: undefined
    };
    setTimetables([...timetables, duplicatedTimetable]);
    toast.success('Timetable duplicated');
  };

  const handleExport = (timetable: Timetable) => {
    // Mock export functionality
    toast.success('Timetable exported successfully');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Edit className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Timetables</h1>
        <p className="text-gray-600">
          View and manage timetables for {selectedDepartment} Department - {selectedShift} shift
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon(status)}
              </div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-gray-600 capitalize">{status === 'all' ? 'Total' : status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="detail" disabled={!selectedTimetable}>
            Detail View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search timetables..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timetables List */}
          <Card>
            <CardHeader>
              <CardTitle>Timetables ({filteredTimetables.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTimetables.map((timetable) => (
                  <div key={timetable.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{timetable.name}</h3>
                        {getStatusBadge(timetable.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Created on {new Date(timetable.createdAt).toLocaleDateString()}
                        {timetable.approvedAt && (
                          <span> • Approved on {new Date(timetable.approvedAt).toLocaleDateString()}</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {timetable.slots.filter(s => s.type !== 'break').length} scheduled classes
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTimetable(timetable);
                          setActiveTab('detail');
                        }}
                      >
                        View
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExport(timetable)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicate(timetable)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      
                      {timetable.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendForApproval(timetable)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {(timetable.status === 'draft' || timetable.status === 'rejected') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(timetable)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredTimetables.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No timetables found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detail" className="space-y-4">
          {selectedTimetable && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Timetable Details</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleExport(selectedTimetable)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDuplicate(selectedTimetable)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TimetableView timetable={selectedTimetable} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}