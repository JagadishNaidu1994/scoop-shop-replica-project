
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageCircle, CheckCircle, Clock } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'responded' | 'resolved';
  submittedAt: string;
  priority: 'low' | 'medium' | 'high';
}

const ContactSubmissionsTab = () => {
  const [submissions] = useState<ContactSubmission[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+44 123 456 789',
      subject: 'Order Issue',
      message: 'I have an issue with my recent order...',
      status: 'new',
      submittedAt: '2024-01-15T10:30:00Z',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+44 987 654 321',
      subject: 'Product Inquiry',
      message: 'I would like to know more about your matcha products...',
      status: 'responded',
      submittedAt: '2024-01-14T14:20:00Z',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Mike Brown',
      email: 'mike@example.com',
      phone: '',
      subject: 'Wholesale Inquiry',
      message: 'Interested in wholesale opportunities...',
      status: 'resolved',
      submittedAt: '2024-01-13T09:15:00Z',
      priority: 'low'
    }
  ]);

  const newSubmissions = submissions.filter(s => s.status === 'new').length;
  const respondedSubmissions = submissions.filter(s => s.status === 'responded').length;
  const resolvedSubmissions = submissions.filter(s => s.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contact Submissions</h2>
        <Button>
          <Mail className="w-4 h-4 mr-2" />
          Send Bulk Reply
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newSubmissions}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{respondedSubmissions}</div>
            <p className="text-xs text-muted-foreground">Responded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedSubmissions}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1" />
                        {submission.email}
                      </div>
                      {submission.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {submission.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{submission.subject}</TableCell>
                  <TableCell className="max-w-xs truncate">{submission.message}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={submission.priority === 'high' ? 'destructive' : submission.priority === 'medium' ? 'secondary' : 'outline'}
                    >
                      {submission.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={submission.status === 'resolved' ? 'default' : submission.status === 'responded' ? 'secondary' : 'outline'}
                    >
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSubmissionsTab;
