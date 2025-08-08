
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Calendar } from 'lucide-react';
import * as z from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  introduction: z.string().optional(),
  picture: z.string().optional(),
  link_address: z.string().optional(),
  sorting: z.number().default(100),
  open_state: z.boolean().default(true),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventActivity {
  id: string;
  serial_number: number | null;
  title: string;
  introduction: string | null;
  picture: string | null;
  link_address: string | null;
  sorting: number;
  open_state: boolean;
  creation_time: string;
  created_at: string;
}

const EventManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventActivity | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      introduction: '',
      picture: '',
      link_address: '',
      sorting: 100,
      open_state: true,
    },
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['event-activities', searchTerm],
    queryFn: async () => {
      let query = supabase.from('event_activities').select('*');
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,introduction.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('sorting', { ascending: true });
      
      if (error) throw error;
      return data as EventActivity[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const insertData = {
        title: data.title,
        introduction: data.introduction || null,
        picture: data.picture || null,
        link_address: data.link_address || null,
        sorting: data.sorting,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('event_activities').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-activities'] });
      toast({ title: 'Success', description: 'Event created successfully' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create event', variant: 'destructive' });
      console.error('Create error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EventFormData> }) => {
      const updateData = {
        title: data.title,
        introduction: data.introduction || null,
        picture: data.picture || null,
        link_address: data.link_address || null,
        sorting: data.sorting,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('event_activities').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-activities'] });
      toast({ title: 'Success', description: 'Event updated successfully' });
      setIsDialogOpen(false);
      setEditingEvent(null);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update event', variant: 'destructive' });
      console.error('Update error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('event_activities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-activities'] });
      toast({ title: 'Success', description: 'Event deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
      console.error('Delete error:', error);
    },
  });

  const onSubmit = (data: EventFormData) => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (event: EventActivity) => {
    setEditingEvent(event);
    form.reset({
      title: event.title,
      introduction: event.introduction || '',
      picture: event.picture || '',
      link_address: event.link_address || '',
      sorting: event.sorting,
      open_state: event.open_state,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Event Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Event Activities Management</span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="introduction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Introduction</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="picture"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Picture URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="link_address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="sorting"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sorting</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="open_state"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormLabel>Active</FormLabel>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingEvent ? 'Update' : 'Create'} Event
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Introduction</TableHead>
                  <TableHead>Picture</TableHead>
                  <TableHead>Link Address</TableHead>
                  <TableHead>Sorting</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Creation Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : events?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">No events found</TableCell>
                  </TableRow>
                ) : (
                  events?.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.serial_number || '-'}</TableCell>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{event.introduction || '-'}</TableCell>
                      <TableCell>{event.picture ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="max-w-xs truncate">{event.link_address || '-'}</TableCell>
                      <TableCell>{event.sorting}</TableCell>
                      <TableCell>
                        <Badge variant={event.open_state ? 'default' : 'secondary'}>
                          {event.open_state ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.creation_time).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EventManagement;
