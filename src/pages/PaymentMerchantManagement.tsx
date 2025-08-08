
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
import { Plus, Search, Edit, Trash2, CreditCard } from 'lucide-react';
import * as z from 'zod';

const merchantSchema = z.object({
  merchant_code: z.string().min(1, 'Merchant code is required'),
  merchant_name: z.string().min(1, 'Merchant name is required'),
  merchant_account: z.string().optional(),
  merchant_number: z.string().optional(),
  payment_merchant_number: z.string().optional(),
  api_interface_address: z.string().optional(),
  backend_address: z.string().optional(),
  open_state: z.boolean().default(true),
});

type MerchantFormData = z.infer<typeof merchantSchema>;

interface PaymentMerchant {
  id: string;
  merchant_code: string;
  merchant_name: string;
  merchant_account: string | null;
  merchant_number: string | null;
  payment_merchant_number: string | null;
  api_interface_address: string | null;
  backend_address: string | null;
  open_state: boolean;
  created_at: string;
}

const PaymentMerchantManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<PaymentMerchant | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MerchantFormData>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      merchant_code: '',
      merchant_name: '',
      merchant_account: '',
      merchant_number: '',
      payment_merchant_number: '',
      api_interface_address: '',
      backend_address: '',
      open_state: true,
    },
  });

  const { data: merchants, isLoading } = useQuery({
    queryKey: ['payment-merchants', searchTerm],
    queryFn: async () => {
      let query = supabase.from('payment_merchants').select('*');
      
      if (searchTerm) {
        query = query.or(`merchant_code.ilike.%${searchTerm}%,merchant_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PaymentMerchant[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: MerchantFormData) => {
      const insertData = {
        merchant_code: data.merchant_code,
        merchant_name: data.merchant_name,
        merchant_account: data.merchant_account || null,
        merchant_number: data.merchant_number || null,
        payment_merchant_number: data.payment_merchant_number || null,
        api_interface_address: data.api_interface_address || null,
        backend_address: data.backend_address || null,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('payment_merchants').insert([insertData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-merchants'] });
      toast({ title: 'Success', description: 'Payment merchant created successfully' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create payment merchant', variant: 'destructive' });
      console.error('Create error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MerchantFormData> }) => {
      const updateData = {
        merchant_code: data.merchant_code,
        merchant_name: data.merchant_name,
        merchant_account: data.merchant_account || null,
        merchant_number: data.merchant_number || null,
        payment_merchant_number: data.payment_merchant_number || null,
        api_interface_address: data.api_interface_address || null,
        backend_address: data.backend_address || null,
        open_state: data.open_state,
      };
      
      const { error } = await supabase.from('payment_merchants').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-merchants'] });
      toast({ title: 'Success', description: 'Payment merchant updated successfully' });
      setIsDialogOpen(false);
      setEditingMerchant(null);
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update payment merchant', variant: 'destructive' });
      console.error('Update error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('payment_merchants').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-merchants'] });
      toast({ title: 'Success', description: 'Payment merchant deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete payment merchant', variant: 'destructive' });
      console.error('Delete error:', error);
    },
  });

  const onSubmit = (data: MerchantFormData) => {
    if (editingMerchant) {
      updateMutation.mutate({ id: editingMerchant.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (merchant: PaymentMerchant) => {
    setEditingMerchant(merchant);
    form.reset({
      merchant_code: merchant.merchant_code,
      merchant_name: merchant.merchant_name,
      merchant_account: merchant.merchant_account || '',
      merchant_number: merchant.merchant_number || '',
      payment_merchant_number: merchant.payment_merchant_number || '',
      api_interface_address: merchant.api_interface_address || '',
      backend_address: merchant.backend_address || '',
      open_state: merchant.open_state,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this payment merchant?')) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingMerchant(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Payment Merchant Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Merchants</span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Merchant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingMerchant ? 'Edit Payment Merchant' : 'Add New Payment Merchant'}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="merchant_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Merchant Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                          name="merchant_account"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Merchant Account</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="merchant_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Merchant Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="payment_merchant_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Merchant Number</FormLabel>
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
                      </div>
                      <FormField
                        control={form.control}
                        name="api_interface_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Interface Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="backend_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Backend Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                          {editingMerchant ? 'Update' : 'Create'} Merchant
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
                    placeholder="Search merchants..."
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
                  <TableHead>Merchant Code</TableHead>
                  <TableHead>Merchant Name</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Merchant Number</TableHead>
                  <TableHead>API Interface</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : merchants?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No payment merchants found</TableCell>
                  </TableRow>
                ) : (
                  merchants?.map((merchant) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>{merchant.merchant_code}</span>
                        </div>
                      </TableCell>
                      <TableCell>{merchant.merchant_name}</TableCell>
                      <TableCell>{merchant.merchant_account || '-'}</TableCell>
                      <TableCell>{merchant.merchant_number || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{merchant.api_interface_address || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={merchant.open_state ? 'default' : 'secondary'}>
                          {merchant.open_state ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(merchant)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(merchant.id)}>
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

export default PaymentMerchantManagement;
