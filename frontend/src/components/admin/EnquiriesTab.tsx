import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, Building2, MessageSquare, Calendar, Edit, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_type: string;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const EnquiriesTab = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('wholesale_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error: any) {
      console.error('Error fetching enquiries:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch enquiries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('wholesale_enquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setEnquiries(prev =>
        prev.map(enq => (enq.id === id ? { ...enq, status: newStatus } : enq))
      );

      toast({
        title: 'Status Updated',
        description: `Enquiry marked as ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const saveNotes = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wholesale_enquiries')
        .update({ notes: notesValue })
        .eq('id', id);

      if (error) throw error;

      setEnquiries(prev =>
        prev.map(enq => (enq.id === id ? { ...enq, notes: notesValue } : enq))
      );

      setEditingNotes(null);
      setNotesValue('');

      toast({
        title: 'Notes Saved',
        description: 'Internal notes updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to save notes',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Wholesale Enquiries</h2>
          <p className="text-gray-600 mt-1">
            Manage and respond to wholesale partnership requests
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2 rounded-2xl">
          {enquiries.length} Total Enquiries
        </Badge>
      </div>

      {enquiries.length === 0 ? (
        <Card className="p-12 text-center rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No enquiries yet</h3>
          <p className="text-gray-600">
            Wholesale enquiries will appear here when submitted through the contact form.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {enquiries.map((enquiry) => (
            <Card key={enquiry.id} className="p-6 hover:shadow-lg transition-shadow rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{enquiry.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getStatusColor(enquiry.status)} rounded-2xl`}>
                      {enquiry.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(enquiry.created_at), 'MMM dd, yyyy • HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {enquiry.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(enquiry.id, 'contacted')}
                      className="rounded-2xl bg-blue-600 hover:bg-blue-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark Contacted
                    </Button>
                  )}
                  {enquiry.status === 'contacted' && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(enquiry.id, 'completed')}
                      className="rounded-2xl bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark Completed
                    </Button>
                  )}
                  {(enquiry.status === 'pending' || enquiry.status === 'contacted') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(enquiry.id, 'rejected')}
                      className="rounded-2xl text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-5 w-5 text-amber-600" />
                  <a href={`mailto:${enquiry.email}`} className="hover:underline">
                    {enquiry.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-5 w-5 text-amber-600" />
                  <a href={`tel:${enquiry.phone}`} className="hover:underline">
                    {enquiry.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 className="h-5 w-5 text-amber-600" />
                  <span>{enquiry.business_type}</span>
                </div>
              </div>

              {enquiry.message && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Internal Notes
                  </h4>
                  {editingNotes !== enquiry.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingNotes(enquiry.id);
                        setNotesValue(enquiry.notes || '');
                      }}
                      className="rounded-2xl"
                    >
                      Edit Notes
                    </Button>
                  )}
                </div>
                {editingNotes === enquiry.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={notesValue}
                      onChange={(e) => setNotesValue(e.target.value)}
                      placeholder="Add internal notes about this enquiry..."
                      rows={3}
                      className="w-full rounded-2xl border-slate-200 focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveNotes(enquiry.id)} className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
                        Save Notes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingNotes(null);
                          setNotesValue('');
                        }}
                        className="rounded-2xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm italic">
                    {enquiry.notes || 'No notes added yet'}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnquiriesTab;
