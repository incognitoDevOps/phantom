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
import { Plus, Search, Edit, Trash2, Eye, Link } from 'lucide-react';
import * as z from 'zod';

const agentSchema = z.object({
  agent_id: z.number().min(1, 'Agent ID is required'),
  login_name: z.string().min(1, 'Login name is required'),
  promotional_code: z.string().optional(),
  superior_agent: z.string().optional(),
  affiliate_links: z.string().url().optional().or(z.literal('')),
  nick_name: z.string().optional(),
  phone_number: z.string().optional(),
  is_agent_administrator: z.boolean().default(false),
  state: z.string().default('open'),
});

type AgentFormData = z.infer<typeof agentSchema>;

interface Agent {
  id: string;
  agent_id: number | null;
  login_name: string;
  promotional_code: string | null;
  superior_agent: string | null;
  affiliate_links: string | null;
  nick_name: string | null;
  phone_number: string | null;
  is_agent_administrator: boolean | null;
  state: string | null;
  created_at: string;
}

const AgentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      agent_id: 0,
      login_name: '',
      promotional_code: '',
      superior_agent: '',
      affiliate_links: '',
      nick_name: '',
      phone_number: '',
      is_agent_administrator: false,
      state: 'open',
    },
  });

  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents', searchTerm, stateFilter],
    queryFn: async () => {
      let query = supabase.from('agents').select('*');
      
      if (searchTerm) {
        query = query.or(`login_name.ilike.%${searchTerm}%,nick_name.ilike.%${searchTerm}%,promotional_code.ilike.%${searchTerm}%`);
      }
      
      if (stateFilter !== 'all') {
        query = query.eq('state', stateFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Agent[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AgentFormData) => {
      // Transform data to match database expectations
      const insertData = {
        agent_id: data.agent_id,
        login_name: data.login_name,
        promotional_code: data.promotional_code || null,
        superior_agent: data.superior_agent || null,
        affiliate_links: data.affiliate_links || null,
        nick_name: data.nick_name || null,
        phone_number: data.phone_number || null,
        is_agent_administrator: data.is_agent_administrator,
        state: data.state,
      };
      
      const { error } = await supabase.from('agents').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({ title: 'Success', description: 'Agent created successfully' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create agent', variant: 'destructive' });
      console.error('Create error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AgentFormData> }) => {
      // Transform data to match database expectations
      const updateData = {
        agent_id: data.agent_id,
        login_name: data.login_name,
        promotional_code: data.promotional_code || null,
        superior_agent: data.superior_agent || null,
        affiliate_links: data.affiliate_links || null,
        nick_name: data.nick_name || null,
        phone_number: data.phone_number || null,
        is_agent_administrator: data.is_agent_administrator,
        state: data.state,
      };
      
      const { error } = await supabase.from('agents').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({ title: 'Success', description: 'Agent updated successfully' });
      setIsDialogOpen(false);
      setEditingAgent(null);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update agent', variant: 'destructive' });
      console.error('Update error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('agents').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({ title: 'Success', description: 'Agent deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete agent', variant: 'destructive' });
      console.error('Delete error:', error);
    },
  });

  const onSubmit = (data: AgentFormData) => {
    if (editingAgent) {
      updateMutation.mutate({ id: editingAgent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    form.reset({
      agent_id: agent.agent_id || 0,
      login_name: agent.login_name,
      promotional_code: agent.promotional_code || '',
      superior_agent: agent.superior_agent || '',
      affiliate_links: agent.affiliate_links || '',
      nick_name: agent.nick_name || '',
      phone_number: agent.phone_number || '',
      is_agent_administrator: agent.is_agent_administrator || false,
      state: agent.state || 'open',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingAgent(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Agent Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Agent Management</span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Agent
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingAgent ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="agent_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Agent ID</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                          name="promotional_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Promotional Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="superior_agent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Superior Agent</FormLabel>
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
                      </div>
                      <FormField
                        control={form.control}
                        name="affiliate_links"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Affiliate Links</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://example.com/register?code=..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="is_agent_administrator"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormLabel>Agent Administrator</FormLabel>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
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
                                  <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingAgent ? 'Update' : 'Create'} Agent
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
                    placeholder="Search agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent ID</TableHead>
                  <TableHead>Login Name</TableHead>
                  <TableHead>Promotional Code</TableHead>
                  <TableHead>Superior Agent</TableHead>
                  <TableHead>Nick Name</TableHead>
                  <TableHead>Administrator</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : agents?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No agents found</TableCell>
                  </TableRow>
                ) : (
                  agents?.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.agent_id}</TableCell>
                      <TableCell>{agent.login_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{agent.promotional_code}</Badge>
                      </TableCell>
                      <TableCell>{agent.superior_agent || '-'}</TableCell>
                      <TableCell>{agent.nick_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={agent.is_agent_administrator ? "default" : "secondary"}>
                          {agent.is_agent_administrator ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={agent.state === 'open' ? 'default' : agent.state === 'closed' ? 'destructive' : 'secondary'}>
                          {agent.state}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {agent.affiliate_links && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(agent.affiliate_links!, '_blank')}
                            >
                              <Link className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(agent)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(agent.id)}>
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

export default AgentManagement;
