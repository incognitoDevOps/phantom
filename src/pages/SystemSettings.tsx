
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Settings, Database, Save } from 'lucide-react';
import * as z from 'zod';

const settingSchema = z.object({
  setting_key: z.string().min(1, 'Setting key is required'),
  setting_value: z.string().optional(),
  setting_type: z.string().min(1, 'Setting type is required'),
  category: z.string().min(1, 'Category is required'),
  display_name: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  sort_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

const dictionarySchema = z.object({
  dictionary_key: z.string().min(1, 'Dictionary key is required'),
  dictionary_value: z.string().min(1, 'Dictionary value is required'),
  category: z.string().min(1, 'Category is required'),
  display_name: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  sort_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

type SettingFormData = z.infer<typeof settingSchema>;
type DictionaryFormData = z.infer<typeof dictionarySchema>;

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  category: string;
  display_name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface DictionaryItem {
  id: string;
  dictionary_key: string;
  dictionary_value: string;
  category: string;
  display_name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false);
  const [isDictionaryDialogOpen, setIsDictionaryDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);
  const [editingDictionary, setEditingDictionary] = useState<DictionaryItem | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const settingForm = useForm<SettingFormData>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      setting_key: '',
      setting_value: '',
      setting_type: 'text',
      category: 'general',
      display_name: '',
      description: '',
      sort_order: 0,
      is_active: true,
    },
  });

  const dictionaryForm = useForm<DictionaryFormData>({
    resolver: zodResolver(dictionarySchema),
    defaultValues: {
      dictionary_key: '',
      dictionary_value: '',
      category: 'general',
      display_name: '',
      description: '',
      sort_order: 0,
      is_active: true,
    },
  });

  // Fetch system settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['system_settings', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase.from('system_settings').select('*');
      
      if (searchTerm) {
        query = query.or(`display_name.ilike.%${searchTerm}%,setting_key.ilike.%${searchTerm}%`);
      }
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query.order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as SystemSetting[];
    },
  });

  // Fetch dictionary items
  const { data: dictionaries, isLoading: dictionariesLoading } = useQuery({
    queryKey: ['dictionary_items', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase.from('dictionary_items').select('*');
      
      if (searchTerm) {
        query = query.or(`display_name.ilike.%${searchTerm}%,dictionary_key.ilike.%${searchTerm}%`);
      }
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query.order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as DictionaryItem[];
    },
  });

  // Setting mutations
  const createSettingMutation = useMutation({
    mutationFn: async (data: SettingFormData) => {
      const { error } = await supabase.from('system_settings').insert({
        setting_key: data.setting_key,
        setting_value: data.setting_value || '',
        setting_type: data.setting_type,
        category: data.category,
        display_name: data.display_name,
        description: data.description || '',
        sort_order: data.sort_order,
        is_active: data.is_active,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_settings'] });
      toast({ title: 'Success', description: 'Setting created successfully' });
      setIsSettingDialogOpen(false);
      settingForm.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create setting', variant: 'destructive' });
      console.error('Create setting error:', error);
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SettingFormData> }) => {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (data.setting_key) updateData.setting_key = data.setting_key;
      if (data.setting_value !== undefined) updateData.setting_value = data.setting_value;
      if (data.setting_type) updateData.setting_type = data.setting_type;
      if (data.category) updateData.category = data.category;
      if (data.display_name) updateData.display_name = data.display_name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;
      if (data.is_active !== undefined) updateData.is_active = data.is_active;

      const { error } = await supabase.from('system_settings').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_settings'] });
      toast({ title: 'Success', description: 'Setting updated successfully' });
      setIsSettingDialogOpen(false);
      setEditingSetting(null);
      settingForm.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update setting', variant: 'destructive' });
      console.error('Update setting error:', error);
    },
  });

  const deleteSettingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('system_settings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_settings'] });
      toast({ title: 'Success', description: 'Setting deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete setting', variant: 'destructive' });
      console.error('Delete setting error:', error);
    },
  });

  // Dictionary mutations
  const createDictionaryMutation = useMutation({
    mutationFn: async (data: DictionaryFormData) => {
      const { error } = await supabase.from('dictionary_items').insert({
        dictionary_key: data.dictionary_key,
        dictionary_value: data.dictionary_value,
        category: data.category,
        display_name: data.display_name,
        description: data.description || '',
        sort_order: data.sort_order,
        is_active: data.is_active,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dictionary_items'] });
      toast({ title: 'Success', description: 'Dictionary item created successfully' });
      setIsDictionaryDialogOpen(false);
      dictionaryForm.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create dictionary item', variant: 'destructive' });
      console.error('Create dictionary error:', error);
    },
  });

  const updateDictionaryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DictionaryFormData> }) => {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (data.dictionary_key) updateData.dictionary_key = data.dictionary_key;
      if (data.dictionary_value) updateData.dictionary_value = data.dictionary_value;
      if (data.category) updateData.category = data.category;
      if (data.display_name) updateData.display_name = data.display_name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;
      if (data.is_active !== undefined) updateData.is_active = data.is_active;

      const { error } = await supabase.from('dictionary_items').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dictionary_items'] });
      toast({ title: 'Success', description: 'Dictionary item updated successfully' });
      setIsDictionaryDialogOpen(false);
      setEditingDictionary(null);
      dictionaryForm.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update dictionary item', variant: 'destructive' });
      console.error('Update dictionary error:', error);
    },
  });

  const deleteDictionaryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('dictionary_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dictionary_items'] });
      toast({ title: 'Success', description: 'Dictionary item deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete dictionary item', variant: 'destructive' });
      console.error('Delete dictionary error:', error);
    },
  });

  const onSettingSubmit = (data: SettingFormData) => {
    if (editingSetting) {
      updateSettingMutation.mutate({ id: editingSetting.id, data });
    } else {
      createSettingMutation.mutate(data);
    }
  };

  const onDictionarySubmit = (data: DictionaryFormData) => {
    if (editingDictionary) {
      updateDictionaryMutation.mutate({ id: editingDictionary.id, data });
    } else {
      createDictionaryMutation.mutate(data);
    }
  };

  const handleEditSetting = (setting: SystemSetting) => {
    setEditingSetting(setting);
    settingForm.reset({
      setting_key: setting.setting_key,
      setting_value: setting.setting_value,
      setting_type: setting.setting_type,
      category: setting.category,
      display_name: setting.display_name,
      description: setting.description,
      sort_order: setting.sort_order,
      is_active: setting.is_active,
    });
    setIsSettingDialogOpen(true);
  };

  const handleEditDictionary = (dictionary: DictionaryItem) => {
    setEditingDictionary(dictionary);
    dictionaryForm.reset({
      dictionary_key: dictionary.dictionary_key,
      dictionary_value: dictionary.dictionary_value,
      category: dictionary.category,
      display_name: dictionary.display_name,
      description: dictionary.description,
      sort_order: dictionary.sort_order,
      is_active: dictionary.is_active,
    });
    setIsDictionaryDialogOpen(true);
  };

  const handleDeleteSetting = (id: string) => {
    if (confirm('Are you sure you want to delete this setting?')) {
      deleteSettingMutation.mutate(id);
    }
  };

  const handleDeleteDictionary = (id: string) => {
    if (confirm('Are you sure you want to delete this dictionary item?')) {
      deleteDictionaryMutation.mutate(id);
    }
  };

  const openCreateSettingDialog = () => {
    setEditingSetting(null);
    settingForm.reset();
    setIsSettingDialogOpen(true);
  };

  const openCreateDictionaryDialog = () => {
    setEditingDictionary(null);
    dictionaryForm.reset();
    setIsDictionaryDialogOpen(true);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'site_settings', label: 'Site Settings' },
    { value: 'security', label: 'Security Settings' },
    { value: 'urls', label: 'URL Configuration' },
    { value: 'formats', label: 'Date/Time Formats' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'app_settings', label: 'App Settings' },
    { value: 'user_settings', label: 'User Settings' },
    { value: 'system_config', label: 'System Configuration' },
    { value: 'user_management', label: 'User Management' },
    { value: 'order_management', label: 'Order Management' },
    { value: 'payment', label: 'Payment Methods' },
    { value: 'user_levels', label: 'User Levels' },
    { value: 'system', label: 'System' },
    { value: 'general', label: 'General' },
  ];

  const settingTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'url', label: 'URL' },
    { value: 'file', label: 'File' },
  ];

  return (
    <AdminLayout title="System Settings & Dictionary Management">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Settings
            </TabsTrigger>
            <TabsTrigger value="dictionary" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Dictionary Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>System Settings</span>
                  <Dialog open={isSettingDialogOpen} onOpenChange={setIsSettingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={openCreateSettingDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Setting
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingSetting ? 'Edit Setting' : 'Add New Setting'}</DialogTitle>
                      </DialogHeader>
                      <Form {...settingForm}>
                        <form onSubmit={settingForm.handleSubmit(onSettingSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={settingForm.control}
                              name="setting_key"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Setting Key</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={settingForm.control}
                              name="display_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Display Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={settingForm.control}
                              name="setting_type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Setting Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {settingTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={settingForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories.slice(1).map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                          {category.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={settingForm.control}
                            name="setting_value"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Setting Value</FormLabel>
                                <FormControl>
                                  {settingForm.watch('setting_type') === 'textarea' ? (
                                    <Textarea {...field} rows={4} />
                                  ) : (
                                    <Input {...field} />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={settingForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={2} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={settingForm.control}
                              name="sort_order"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sort Order</FormLabel>
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
                              control={settingForm.control}
                              name="is_active"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 pt-6">
                                  <FormLabel>Active</FormLabel>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsSettingDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              {editingSetting ? 'Update' : 'Create'} Setting
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
                        placeholder="Search settings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Setting Key</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settingsLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                      </TableRow>
                    ) : settings?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">No settings found</TableCell>
                      </TableRow>
                    ) : (
                      settings?.map((setting) => (
                        <TableRow key={setting.id}>
                          <TableCell className="font-medium">{setting.display_name}</TableCell>
                          <TableCell><code className="text-sm bg-muted px-1 rounded">{setting.setting_key}</code></TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={setting.setting_value}>
                              {setting.setting_value}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {setting.setting_type}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {setting.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              setting.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {setting.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditSetting(setting)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteSetting(setting.id)}>
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
          </TabsContent>

          <TabsContent value="dictionary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Dictionary Management</span>
                  <Dialog open={isDictionaryDialogOpen} onOpenChange={setIsDictionaryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={openCreateDictionaryDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Dictionary Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingDictionary ? 'Edit Dictionary Item' : 'Add New Dictionary Item'}</DialogTitle>
                      </DialogHeader>
                      <Form {...dictionaryForm}>
                        <form onSubmit={dictionaryForm.handleSubmit(onDictionarySubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={dictionaryForm.control}
                              name="dictionary_key"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dictionary Key</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={dictionaryForm.control}
                              name="dictionary_value"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dictionary Value</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={dictionaryForm.control}
                              name="display_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Display Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={dictionaryForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories.slice(1).map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                          {category.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={dictionaryForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={2} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={dictionaryForm.control}
                              name="sort_order"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sort Order</FormLabel>
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
                              control={dictionaryForm.control}
                              name="is_active"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 pt-6">
                                  <FormLabel>Active</FormLabel>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsDictionaryDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              {editingDictionary ? 'Update' : 'Create'} Dictionary Item
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
                        placeholder="Search dictionary items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Dictionary Key</TableHead>
                      <TableHead>Dictionary Value</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dictionariesLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                      </TableRow>
                    ) : dictionaries?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No dictionary items found</TableCell>
                      </TableRow>
                    ) : (
                      dictionaries?.map((dictionary) => (
                        <TableRow key={dictionary.id}>
                          <TableCell className="font-medium">{dictionary.display_name}</TableCell>
                          <TableCell><code className="text-sm bg-muted px-1 rounded">{dictionary.dictionary_key}</code></TableCell>
                          <TableCell><code className="text-sm bg-muted px-1 rounded">{dictionary.dictionary_value}</code></TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {dictionary.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              dictionary.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {dictionary.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditDictionary(dictionary)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteDictionary(dictionary.id)}>
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;
