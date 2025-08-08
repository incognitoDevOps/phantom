
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
import { Plus, Search, Edit, Trash2, Wallet } from 'lucide-react';
import * as z from 'zod';

const channelSchema = z.object({
  merchant_name: z.string().min(1, 'Merchant name is required'),
  channel_name: z.string().min(1, 'Channel name is required'),
  payment_channels: z.string().optional(),
  payment_methods: z.string().optional(),
  exchange_rate: z.number().default(1),
  rate_percentage: z.number().default(0),
  minimum_payment_amount: z.number().default(0),
  maximum_payment_amount: z.number().default(0),
  payment_amount_options: z.string().optional(),
  sorting: z.number().default(100),
  default_display_payment_amount: z.number().default(100),
  can_only_integers_be_entered: z.boolean().default(true),
  open_state: z.boolean().default(true),
});

type ChannelFormData = z.infer<typeof channelSchema>;

interface PaymentChannel {
  id: string;
  merchant_name: string;
  channel_name: string;
  payment_channels: string | null;
  payment_methods: string | null;
  exchange_rate: number;
  rate_percentage: number;
  minimum_payment_amount: number;
  maximum_payment_amount: number;
  payment_amount_options: string | null;
  sorting: number;
  default_display_payment_amount: number;
  can_only_integers_be_entered: boolean;
  open_state: boolean;
  created_at: string;
}

const PaymentChannelManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<PaymentChannel | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ChannelFormData>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      merchant_name: '',
      channel_name: '',
      payment_channels: '',
      payment_methods: '',
      exchange_rate: 1,
      rate_percentage: 0,
      minimum_payment_amount: 0,
      maximum_payment_amount: 0,
      payment_amount_options: '',
      sorting: 100,
      default_display_payment_amount: 100,
      can_only_integers_be_entered: true,
      open_state: true,
    },
  });

  const { data: channels, isLoading } = useQuery({
    queryKey: ['payment-channels', searchTerm],
    queryFn: async () => {
      let query = supabase.from('payment_channels').select('*');
      
      if (searchTerm) {
        query = query.or(`merchant_name.ilike.%${searchTerm}%,channel_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('sorting', { ascending: true });
      
      if (error) throw error;
      return data as PaymentChannel[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ChannelFormData) => {
      const insertData = {
        merchant_name: data.merchant_name,
        channel_name: data.channel_name,
        payment_channels: data.payment_channels || null,
        payment_methods: data.payment_methods || null,
        exchange_rate: data.exchange_rate,
        rate_percentage: data.rate_percentage,
        minimum_payment_amount: data.minimum_payment_amount,
        maximum_payment_amount: data.maximum_payment_amount,
        payment_amount_options: data.payment_amount_options || null,
        sorting: data.sorting,
        default_display_payment_amount: data.default_display_payment_amount,
        can_only_integers_be_entered: data.can_only_integers_be_entered,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('payment_channels').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-channels'] });
      toast({ title: 'Success', description: 'Payment channel created successfully' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create payment channel', variant: 'destructive' });
      console.error('Create error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ChannelFormData> }) => {
      const updateData = {
        merchant_name: data.merchant_name,
        channel_name: data.channel_name,
        payment_channels: data.payment_channels || null,
        payment_methods: data.payment_methods || null,
        exchange_rate: data.exchange_rate,
        rate_percentage: data.rate_percentage,
        minimum_payment_amount: data.minimum_payment_amount,
        maximum_payment_amount: data.maximum_payment_amount,
        payment_amount_options: data.payment_amount_options || null,
        sorting: data.sorting,
        default_display_payment_amount: data.default_display_payment_amount,
        can_only_integers_be_entered: data.can_only_integers_be_entered,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('payment_channels').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-channels'] });
      toast({ title: 'Success', description: 'Payment channel updated successfully' });
      setIsDialogOpen(false);
      setEditingChannel(null);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update payment channel', variant: 'destructive' });
      console.error('Update error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('payment_channels').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-channels'] });
      toast({ title: 'Success', description: 'Payment channel deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete payment channel', variant: 'destructive' });
      console.error('Delete error:', error);
    },
  });

  const onSubmit = (data: ChannelFormData) => {
    if (editingChannel) {
      updateMutation.mutate({ id: editingChannel.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (channel: PaymentChannel) => {
    setEditingChannel(channel);
    form.reset({
      merchant_name: channel.merchant_name,
      channel_name: channel.channel_name,
      payment_channels: channel.payment_channels || '',
      payment_methods: channel.payment_methods || '',
      exchange_rate: channel.exchange_rate,
      rate_percentage: channel.rate_percentage,
      minimum_payment_amount: channel.minimum_payment_amount,
      maximum_payment_amount: channel.maximum_payment_amount,
      payment_amount_options: channel.payment_amount_options || '',
      sorting: channel.sorting,
      default_display_payment_amount: channel.default_display_payment_amount,
      can_only_integers_be_entered: channel.can_only_integers_be_entered,
      open_state: channel.open_state,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this payment channel?')) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingChannel(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Payment Channel Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Channels</span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Channel
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{editingChannel ? 'Edit Payment Channel' : 'Add New Payment Channel'}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="merchant_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Merchant Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="channel_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Channel Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="payment_channels"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Channels</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="payment_methods"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Methods</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="exchange_rate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Exchange Rate</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="rate_percentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rate Percentage</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="minimum_payment_amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Payment Amount</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="maximum_payment_amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Payment Amount</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
                          name="default_display_payment_amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Default Display Payment Amount</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="can_only_integers_be_entered"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormLabel>Only Integers</FormLabel>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
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
                        name="payment_amount_options"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Amount Options</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 100,500,1000" />
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
                          {editingChannel ? 'Update' : 'Create'} Channel
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
                    placeholder="Search channels..."
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
                  <TableHead>Merchant</TableHead>
                  <TableHead>Channel Name</TableHead>
                  <TableHead>Payment Methods</TableHead>
                  <TableHead>Exchange Rate</TableHead>
                  <TableHead>Rate %</TableHead>
                  <TableHead>Min Amount</TableHead>
                  <TableHead>Max Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : channels?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">No payment channels found</TableCell>
                  </TableRow>
                ) : (
                  channels?.map((channel) => (
                    <TableRow key={channel.id}>
                      <TableCell className="font-medium">{channel.merchant_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Wallet className="h-4 w-4" />
                          <span>{channel.channel_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{channel.payment_methods || '-'}</TableCell>
                      <TableCell>{channel.exchange_rate}</TableCell>
                      <TableCell>{channel.rate_percentage}%</TableCell>
                      <TableCell>{channel.minimum_payment_amount}</TableCell>
                      <TableCell>{channel.maximum_payment_amount}</TableCell>
                      <TableCell>
                        <Badge variant={channel.open_state ? 'default' : 'secondary'}>
                          {channel.open_state ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(channel)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(channel.id)}>
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

export default PaymentChannelManagement;
