
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Shield } from 'lucide-react';
import * as z from 'zod';

const roleSchema = z.object({
  role_name: z.string().min(1, 'Role name is required'),
  open_state: z.boolean().default(true),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface Role {
  id: string;
  serial_number: number | null;
  role_name: string;
  open_state: boolean;
  created_at: string;
}

const RoleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role_name: '',
      open_state: true,
    },
  });

  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles', searchTerm],
    queryFn: async () => {
      let query = supabase.from('roles').select('*');
      
      if (searchTerm) {
        query = query.ilike('role_name', `%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('serial_number', { ascending: true, nullsFirst: false });
      
      if (error) throw error;
      return data as Role[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: RoleFormData) => {
      const insertData = {
        role_name: data.role_name,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('roles').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({ title: 'Success', description: 'Role created successfully' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create role', variant: 'destructive' });
      console.error('Create error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RoleFormData> }) => {
      const updateData = {
        role_name: data.role_name,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('roles').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({ title: 'Success', description: 'Role updated successfully' });
      setIsDialogOpen(false);
      setEditingRole(null);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update role', variant: 'destructive' });
      console.error('Update error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('roles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({ title: 'Success', description: 'Role deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete role', variant: 'destructive' });
      console.error('Delete error:', error);
    },
  });

  const onSubmit = (data: RoleFormData) => {
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.reset({
      role_name: role.role_name,
      open_state: role.open_state,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingRole(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Role Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Role List</span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="role_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingRole ? 'Update' : 'Create'} Role
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
                    placeholder="Search roles..."
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
                  <TableHead>Role Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : roles?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No roles found</TableCell>
                  </TableRow>
                ) : (
                  roles?.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.serial_number || '-'}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <span>{role.role_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.open_state ? 'default' : 'secondary'}>
                          {role.open_state ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(role.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(role.id)}>
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

export default RoleManagement;
