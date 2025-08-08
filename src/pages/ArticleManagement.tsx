
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  serial_number: number | null;
  picture: string | null;
  title: string;
  category: string;
  category_id: string | null;
  introduction: string | null;
  content: string | null;
  link_address: string | null;
  sorting: number;
  open_state: boolean;
  release_time: string | null;
  confirm_button_name: string | null;
  confirm_button_path: string | null;
  creation_time: string;
  operate: string | null;
}

interface Category {
  id: string;
  category_name: string;
}

const ArticleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    category_id: '',
    introduction: '',
    content: '',
    picture: '',
    link_address: '',
    confirm_button_name: '',
    confirm_button_path: '',
    sorting: '0',
    open_state: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('sorting', { ascending: true });
      
      if (error) throw error;
      return data as Article[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, category_name')
        .eq('open_state', true)
        .order('classification_number', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: async (newArticle: any) => {
      const { data, error } = await supabase
        .from('articles')
        .insert([newArticle])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({ title: "Success", description: "Article created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to create article", variant: "destructive" });
    }
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({ title: "Success", description: "Article updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update article", variant: "destructive" });
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({ title: "Success", description: "Article deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete article", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      category_id: '',
      introduction: '',
      content: '',
      picture: '',
      link_address: '',
      confirm_button_name: '',
      confirm_button_path: '',
      sorting: '0',
      open_state: true
    });
    setEditingArticle(null);
  };

  const handleSubmit = () => {
    const selectedCategory = categories?.find(cat => cat.id === formData.category_id);
    
    const articleData = {
      title: formData.title,
      category: selectedCategory?.category_name || formData.category,
      category_id: formData.category_id || null,
      introduction: formData.introduction || null,
      content: formData.content || null,
      picture: formData.picture || null,
      link_address: formData.link_address || null,
      confirm_button_name: formData.confirm_button_name || null,
      confirm_button_path: formData.confirm_button_path || null,
      sorting: parseInt(formData.sorting) || 0,
      open_state: formData.open_state,
      release_time: new Date().toISOString()
    };

    if (editingArticle) {
      updateArticleMutation.mutate({ id: editingArticle.id, updates: articleData });
    } else {
      createArticleMutation.mutate(articleData);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category,
      category_id: article.category_id || '',
      introduction: article.introduction || '',
      content: article.content || '',
      picture: article.picture || '',
      link_address: article.link_address || '',
      confirm_button_name: article.confirm_button_name || '',
      confirm_button_path: article.confirm_button_path || '',
      sorting: article.sorting.toString(),
      open_state: article.open_state
    });
    setIsDialogOpen(true);
  };

  const filteredArticles = articles?.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="文章管理">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>文章管理</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索文章标题或分类..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    添加文章
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingArticle ? '编辑文章' : '添加文章'}</DialogTitle>
                    <DialogDescription>
                      {editingArticle ? '修改文章信息' : '创建新的文章'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        文章标题
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category_id" className="text-right">
                        分类
                      </Label>
                      <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.category_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="picture" className="text-right">
                        图片URL
                      </Label>
                      <Input
                        id="picture"
                        value={formData.picture}
                        onChange={(e) => setFormData(prev => ({ ...prev, picture: e.target.value }))}
                        className="col-span-3"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="introduction" className="text-right">
                        简介
                      </Label>
                      <Textarea
                        id="introduction"
                        value={formData.introduction}
                        onChange={(e) => setFormData(prev => ({ ...prev, introduction: e.target.value }))}
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content" className="text-right">
                        内容
                      </Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="col-span-3"
                        rows={6}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="link_address" className="text-right">
                        链接地址
                      </Label>
                      <Input
                        id="link_address"
                        value={formData.link_address}
                        onChange={(e) => setFormData(prev => ({ ...prev, link_address: e.target.value }))}
                        className="col-span-3"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirm_button_name" className="text-right">
                        确认按钮名称
                      </Label>
                      <Input
                        id="confirm_button_name"
                        value={formData.confirm_button_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirm_button_name: e.target.value }))}
                        className="col-span-3"
                        placeholder="阅读详情"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sorting" className="text-right">
                        排序
                      </Label>
                      <Input
                        id="sorting"
                        type="number"
                        value={formData.sorting}
                        onChange={(e) => setFormData(prev => ({ ...prev, sorting: e.target.value }))}
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
                      {editingArticle ? '更新' : '创建'}
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
                <TableHead>序号</TableHead>
                <TableHead>图片</TableHead>
                <TableHead>标题</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>简介</TableHead>
                <TableHead>排序</TableHead>
                <TableHead>开启状态</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : filteredArticles?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                filteredArticles?.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>{article.serial_number || '-'}</TableCell>
                    <TableCell>
                      {article.picture ? (
                        <img src={article.picture} alt="Article" className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                          暂无图片
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{article.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{article.introduction || '-'}</TableCell>
                    <TableCell>{article.sorting}</TableCell>
                    <TableCell>
                      <Badge variant={article.open_state ? 'default' : 'secondary'}>
                        {article.open_state ? '开启' : '关闭'}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.release_time ? new Date(article.release_time).toLocaleString() : '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteArticleMutation.mutate(article.id)}
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

export default ArticleManagement;
