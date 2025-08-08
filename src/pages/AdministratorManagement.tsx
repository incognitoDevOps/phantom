
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, UserCog } from 'lucide-react';
import * as z from 'zod';

const administratorSchema = z.object({
  login_name: z.string().min(1, 'Login name is required'),
  nick_name: z.string().optional(),
  phone_number: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  state: z.string().default('open'),
});

type AdministratorFormData = z.infer<typeof administratorSchema>;

interface Administrator {
  id: string;
  serial_number: number | null;
  login_name: string;
  nick_name: string | null;
  phone_number: string | null;
  role: string;
  state: string;
  created_at: string;
}

const AdministratorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AdministratorFormData>({
    resolver: zodResolver(administratorSchema),
    defaultValues: {
      login_name: '',
      nick_name: '',
      phone_number: '',
      role: '',
      state: 'open',
    },
  });

  // Fetch roles for the select dropdown
  const { data: roles } = useQuery({
    queryKey: ['roles-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('roles').select('role_name').eq('open_state', true);
      if (error) throw error;
      return data;
    },
  });

  const { data: administrators, isLoading } = useQuery({
    queryKey: ['administrators', searchTerm, roleFilter],
    queryFn: async () => {
      let query = supabase.from('administrators').select('*');
      
      if (searchTerm) {
        query = query.or(`login_name.ilike.%${searchTerm}%,nick_name.ilike.%${searchTerm}%`);
      }
      
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }
      
      const { data, error } = await query.order('serial_number', { ascending: true, nullsFirst: false });
      
      if (error) throw error;
      return data as Administrator[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AdministratorFormData) => {
      const insertData = {
        login_name: data.login_name,
        nick_name: data.nick_name || null,
        phone_number: data.phone_number || null,
        role: data.role,
        state: data.state,
      };
      
      const { error } = await supabase.from('administrators').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administrators'] });
      toast({ title: 'Success', description: 'Administrator created successfully' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create administrator', variant: 'destructive' });
      console.error('Create error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AdministratorFormData> }) => {
      const updateData = {
        login_name: data.login_name,
        nick_name: data.nick_name || null,
        phone_number: data.phone_number || null,
        role: data.role,
        state: data.state,
      };
      
      const { error } = await supabase.from('administrators').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administrators'] });
      toast({ title: 'Success', description: 'Administrator updated successfully' });
      setIsDialogOpen(false);
      setEditingAdmin(null);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update administrator', variant: 'destructive' });
      console.error('Update error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('administrators').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administrators'] });
      toast({ title: 'Success', description: 'Administrator deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete administrator', variant: 'destructive' });
      console.error('Delete error:', error);
    },
  });

  const onSubmit = (data: AdministratorFormData) => {
    if (editingAdmin) {
      updateMutation.mutate({ id: editingAdmin.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (admin: Administrator) => {
    setEditingAdmin(admin);
    form.reset({
      login_name: admin.login_name,
      nick_name: admin.nick_name || '',
      phone_number: admin.phone_number || '',
      role: admin.role,
      state: admin.state,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this administrator?')) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingAdmin(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Administrator Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Administrator List</span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Administrator
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAdmin ? 'Edit Administrator' : 'Add New Administrator'}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="login_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Login Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nick_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nick Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
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
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {roles?.map((role) => (
                                  <SelectItem key={role.role_name} value={role.role_name}>
                                    {role.role_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingAdmin ? 'Update' : 'Create'} Administrator
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
                    placeholder="Search administrators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles?.map((role) => (
                    <SelectItem key={role.role_name} value={role.role_name}>
                      {role.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Login Name</TableHead>
                  <TableHead>Nick Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : administrators?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No administrators found</TableCell>
                  </TableRow>
                ) : (
                  administrators?.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.serial_number || '-'}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <UserCog className="h-4 w-4" />
                          <span>{admin.login_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{admin.nick_name || '-'}</TableCell>
                      <TableCell>{admin.phone_number || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{admin.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.state === 'open' ? 'default' : 'secondary'}>
                          {admin.state}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(admin)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(admin.id)}>
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

export default AdministratorManagement;
