
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  category_name: string;
  classification_number: number | null;
  open_state: boolean;
  creation_time: string;
}

const CategoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    category_name: '',
    classification_number: '',
    open_state: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('classification_number', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (newCategory: any) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: "Success", description: "Category created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: "Success", description: "Category updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      category_name: '',
      classification_number: '',
      open_state: true
    });
    setEditingCategory(null);
  };

  const handleSubmit = () => {
    const categoryData = {
      category_name: formData.category_name,
      classification_number: formData.classification_number ? parseInt(formData.classification_number) : null,
      open_state: formData.open_state
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, updates: categoryData });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name,
      classification_number: category.classification_number?.toString() || '',
      open_state: category.open_state
    });
    setIsDialogOpen(true);
  };

  const filteredCategories = categories?.filter(category =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="分类列表">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>分类管理</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索分类名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    添加分类
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? '编辑分类' : '添加分类'}</DialogTitle>
                    <DialogDescription>
                      {editingCategory ? '修改分类信息' : '创建新的分类'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category_name" className="text-right">
                        分类名称
                      </Label>
                      <Input
                        id="category_name"
                        value={formData.category_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, category_name: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="classification_number" className="text-right">
                        分类编号
                      </Label>
                      <Input
                        id="classification_number"
                        type="number"
                        value={formData.classification_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, classification_number: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="open_state" className="text-right">
                        开启状态
                      </Label>
                      <Switch
                        id="open_state"
                        checked={formData.open_state}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, open_state: checked }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                      {editingCategory ? '更新' : '创建'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>分类编号</TableHead>
                <TableHead>分类名称</TableHead>
                <TableHead>开启状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : filteredCategories?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                filteredCategories?.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.classification_number || '-'}</TableCell>
                    <TableCell className="font-medium">{category.category_name}</TableCell>
                    <TableCell>
                      <Badge variant={category.open_state ? 'default' : 'secondary'}>
                        {category.open_state ? '开启' : '关闭'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(category.creation_time).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
    </AdminLayout>
  );
};

export default CategoryList;
