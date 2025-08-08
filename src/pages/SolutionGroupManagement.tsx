
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SolutionGroup {
  id: string;
  serial_number: number;
  name: string;
  agent_name: string | null;
  number_of_orders: number;
  program_plan: string | null;
  associated_users: number;
  open_state: boolean;
  is_default: boolean;
  is_team_mode: boolean;
  share: number;
  created_at: string;
}

interface SolutionGroupFormData {
  name: string;
  agent_name: string;
  number_of_orders: number;
  program_plan: string;
  associated_users: number;
  open_state: boolean;
  is_default: boolean;
  is_team_mode: boolean;
  share: number;
}

const SolutionGroupManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SolutionGroup | null>(null);
  const [formData, setFormData] = useState<SolutionGroupFormData>({
    name: '',
    agent_name: '',
    number_of_orders: 0,
    program_plan: '',
    associated_users: 0,
    open_state: true,
    is_default: false,
    is_team_mode: false,
    share: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch solution groups
  const { data: solutionGroups = [], isLoading } = useQuery({
    queryKey: ['solution-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solution_groups')
        .select('*')
        .order('serial_number', { ascending: true });
      
      if (error) throw error;
      return data as SolutionGroup[];
    },
  });

  // Add solution group mutation
  const addGroupMutation = useMutation({
    mutationFn: async (newGroup: SolutionGroupFormData) => {
      const { data, error } = await supabase
        .from('solution_groups')
        .insert([newGroup])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution-groups'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "成功",
        description: "解决方案组已成功添加",
      });
    },
    onError: (error) => {
      toast({
        title: "错误",
        description: "添加解决方案组失败",
        variant: "destructive",
      });
      console.error('Error adding solution group:', error);
    },
  });

  // Update solution group mutation
  const updateGroupMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SolutionGroupFormData> }) => {
      const { data, error } = await supabase
        .from('solution_groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution-groups'] });
      setIsEditDialogOpen(false);
      setEditingGroup(null);
      resetForm();
      toast({
        title: "成功",
        description: "解决方案组已成功更新",
      });
    },
    onError: (error) => {
      toast({
        title: "错误",
        description: "更新解决方案组失败",
        variant: "destructive",
      });
      console.error('Error updating solution group:', error);
    },
  });

  // Delete solution group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('solution_groups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution-groups'] });
      toast({
        title: "成功",
        description: "解决方案组已成功删除",
      });
    },
    onError: (error) => {
      toast({
        title: "错误",
        description: "删除解决方案组失败",
        variant: "destructive",
      });
      console.error('Error deleting solution group:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      agent_name: '',
      number_of_orders: 0,
      program_plan: '',
      associated_users: 0,
      open_state: true,
      is_default: false,
      is_team_mode: false,
      share: 0,
    });
  };

  const handleEdit = (group: SolutionGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      agent_name: group.agent_name || '',
      number_of_orders: group.number_of_orders,
      program_plan: group.program_plan || '',
      associated_users: group.associated_users,
      open_state: group.open_state,
      is_default: group.is_default,
      is_team_mode: group.is_team_mode,
      share: group.share,
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      updateGroupMutation.mutate({
        id: editingGroup.id,
        updates: formData,
      });
    } else {
      addGroupMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    deleteGroupMutation.mutate(id);
  };

  const exportToCSV = () => {
    const headers = ['Serial Number', 'Name', 'Agent Name', 'Orders', 'Program Plan', 'Users', 'Status', 'Default', 'Team Mode', 'Share %'];
    const csvData = filteredGroups.map(group => [
      group.serial_number,
      group.name,
      group.agent_name || '',
      group.number_of_orders,
      group.program_plan || '',
      group.associated_users,
      group.open_state ? 'Active' : 'Inactive',
      group.is_default ? 'Yes' : 'No',
      group.is_team_mode ? 'Yes' : 'No',
      group.share
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solution_groups.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter and search functionality
  const filteredGroups = solutionGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (group.agent_name && group.agent_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && group.open_state) ||
                         (filterStatus === 'inactive' && !group.open_state);
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

  const FormFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">解决方案组名称</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="agent_name">代理名称</Label>
        <Input
          id="agent_name"
          value={formData.agent_name}
          onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="number_of_orders">订单数量</Label>
        <Input
          id="number_of_orders"
          type="number"
          value={formData.number_of_orders}
          onChange={(e) => setFormData({ ...formData, number_of_orders: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div>
        <Label htmlFor="program_plan">程序计划</Label>
        <Select value={formData.program_plan} onValueChange={(value) => setFormData({ ...formData, program_plan: value })}>
          <SelectTrigger>
            <SelectValue placeholder="选择计划" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Basic Plan">基础计划</SelectItem>
            <SelectItem value="Premium Plan">高级计划</SelectItem>
            <SelectItem value="Standard Plan">标准计划</SelectItem>
            <SelectItem value="Enterprise Plan">企业计划</SelectItem>
            <SelectItem value="Advanced Plan">高级计划</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="associated_users">关联用户数</Label>
        <Input
          id="associated_users"
          type="number"
          value={formData.associated_users}
          onChange={(e) => setFormData({ ...formData, associated_users: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div>
        <Label htmlFor="share">分享比例 (%)</Label>
        <Input
          id="share"
          type="number"
          step="0.01"
          value={formData.share}
          onChange={(e) => setFormData({ ...formData, share: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="open_state"
          checked={formData.open_state}
          onCheckedChange={(checked) => setFormData({ ...formData, open_state: checked })}
        />
        <Label htmlFor="open_state">启用状态</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_default"
          checked={formData.is_default}
          onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
        />
        <Label htmlFor="is_default">默认组</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_team_mode"
          checked={formData.is_team_mode}
          onCheckedChange={(checked) => setFormData({ ...formData, is_team_mode: checked })}
        />
        <Label htmlFor="is_team_mode">团队模式</Label>
      </div>
    </div>
  );

  return (
    <AdminLayout title="解决方案组管理">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索解决方案组..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">非活跃</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  添加解决方案组
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>添加新解决方案组</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <FormFields />
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button type="button" variant="outline" onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}>
                      取消
                    </Button>
                    <Button type="submit" disabled={addGroupMutation.isPending}>
                      {addGroupMutation.isPending ? '添加中...' : '添加'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">总解决方案组</div>
            <div className="text-2xl font-bold text-blue-600">{solutionGroups.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">活跃组</div>
            <div className="text-2xl font-bold text-green-600">
              {solutionGroups.filter(g => g.open_state).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">总订单</div>
            <div className="text-2xl font-bold text-purple-600">
              {solutionGroups.reduce((sum, g) => sum + g.number_of_orders, 0)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">总用户</div>
            <div className="text-2xl font-bold text-orange-600">
              {solutionGroups.reduce((sum, g) => sum + g.associated_users, 0)}
            </div>
          </div>
        </div>

        {/* Solution Groups Table */}
        <div className="bg-white rounded-lg shadow border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>序号</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>代理名称</TableHead>
                <TableHead>订单数</TableHead>
                <TableHead>程序计划</TableHead>
                <TableHead>关联用户</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>默认</TableHead>
                <TableHead>团队模式</TableHead>
                <TableHead>分享 (%)</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : paginatedGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    没有找到解决方案组
                  </TableCell>
                </TableRow>
              ) : (
                paginatedGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.serial_number}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.agent_name || '-'}</TableCell>
                    <TableCell>{group.number_of_orders}</TableCell>
                    <TableCell>{group.program_plan || '-'}</TableCell>
                    <TableCell>{group.associated_users}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        group.open_state 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {group.open_state ? '活跃' : '非活跃'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {group.is_default ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">是</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">否</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {group.is_team_mode ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">是</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">否</span>
                      )}
                    </TableCell>
                    <TableCell>{group.share}%</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                您确定要删除解决方案组 "{group.name}" 吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(group.id)}
                                disabled={deleteGroupMutation.isPending}
                              >
                                {deleteGroupMutation.isPending ? '删除中...' : '删除'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>编辑解决方案组</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FormFields />
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingGroup(null);
                  resetForm();
                }}>
                  取消
                </Button>
                <Button type="submit" disabled={updateGroupMutation.isPending}>
                  {updateGroupMutation.isPending ? '更新中...' : '更新'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default SolutionGroupManagement;
