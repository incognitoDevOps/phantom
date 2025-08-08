import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Phone, MessageCircle, Link } from 'lucide-react';
import * as z from 'zod';

const customerServiceSchema = z.object({
  service_name: z.string().min(1, 'Service name is required'),
  service_type: z.string().min(1, 'Service type is required'),
  phone_number: z.string().optional(),
  service_account: z.string().optional(),
  service_link: z.string().url().optional().or(z.literal('')),
  service_hours: z.string().default('09:00 - 22:00'),
  open_state: z.boolean().default(true),
});

type CustomerServiceFormData = z.infer<typeof customerServiceSchema>;

interface CustomerService {
  id: string;
  service_name: string;
  service_type: string;
  phone_number: string | null;
  service_account: string | null;
  service_link: string | null;
  service_hours: string | null;
  open_state: boolean | null;
  created_at: string;
}

const CustomerService = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<CustomerService | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CustomerServiceFormData>({
    resolver: zodResolver(customerServiceSchema),
    defaultValues: {
      service_name: '',
      service_type: '',
      phone_number: '',
      service_account: '',
      service_link: '',
      service_hours: '09:00 - 22:00',
      open_state: true,
    },
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['customer-service', searchTerm, typeFilter],
    queryFn: async () => {
      let query = supabase.from('customer_service').select('*');
      
      if (searchTerm) {
        query = query.or(`service_name.ilike.%${searchTerm}%,service_type.ilike.%${searchTerm}%`);
      }
      
      if (typeFilter !== 'all') {
        query = query.eq('service_type', typeFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CustomerService[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CustomerServiceFormData) => {
      // Transform data to match database expectations
      const insertData = {
        service_name: data.service_name,
        service_type: data.service_type,
        phone_number: data.phone_number || null,
        service_account: data.service_account || null,
        service_link: data.service_link || null,
        service_hours: data.service_hours,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('customer_service').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-service'] });
      toast({ title: 'Success', description: 'Customer service created successfully' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create customer service', variant: 'destructive' });
      console.error('Create error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CustomerServiceFormData> }) => {
      // Transform data to match database expectations
      const updateData = {
        service_name: data.service_name,
        service_type: data.service_type,
        phone_number: data.phone_number || null,
        service_account: data.service_account || null,
        service_link: data.service_link || null,
        service_hours: data.service_hours,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('customer_service').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-service'] });
      toast({ title: 'Success', description: 'Customer service updated successfully' });
      setIsDialogOpen(false);
      setEditingService(null);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update customer service', variant: 'destructive' });
      console.error('Update error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('customer_service').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-service'] });
      toast({ title: 'Success', description: 'Customer service deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete customer service', variant: 'destructive' });
      console.error('Delete error:', error);
    },
  });

  const onSubmit = (data: CustomerServiceFormData) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (service: CustomerService) => {
    setEditingService(service);
    form.reset({
      service_name: service.service_name,
      service_type: service.service_type,
      phone_number: service.phone_number || '',
      service_account: service.service_account || '',
      service_link: service.service_link || '',
      service_hours: service.service_hours || '09:00 - 22:00',
      open_state: service.open_state || true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer service?')) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingService(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getServiceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'telegram':
      case 'online chat':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout title="Customer Service List">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Customer Service Management</span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingService ? 'Edit Customer Service' : 'Add New Customer Service'}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="service_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="service_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Online Chat">Online Chat</SelectItem>
                                  <SelectItem value="Telegram">Telegram</SelectItem>
                                  <SelectItem value="Phone">Phone</SelectItem>
                                  <SelectItem value="Email">Email</SelectItem>
                                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="service_account"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Account</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="service_hours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Hours</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="09:00 - 22:00" />
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
                      <FormField
                        control={form.control}
                        name="service_link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Link</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingService ? 'Update' : 'Create'} Service
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
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Online Chat">Online Chat</SelectItem>
                  <SelectItem value="Telegram">Telegram</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Service Account</TableHead>
                  <TableHead>Service Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : services?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No customer services found</TableCell>
                  </TableRow>
                ) : (
                  services?.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getServiceIcon(service.service_type)}
                          <span>{service.service_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{service.service_type}</Badge>
                      </TableCell>
                      <TableCell>{service.phone_number || '-'}</TableCell>
                      <TableCell>{service.service_account || '-'}</TableCell>
                      <TableCell>{service.service_hours}</TableCell>
                      <TableCell>
                        <Badge variant={service.open_state ? 'default' : 'secondary'}>
                          {service.open_state ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {service.service_link && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(service.service_link!, '_blank')}
                            >
                              <Link className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
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

export default CustomerService;
