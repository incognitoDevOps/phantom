
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface UserLevel {
  id: string;
  serial_number: number | null;
  icon_url: string | null;
  name: string;
  level_value: number;
  withdrawal_restrictions: string | null;
  order_grabbing_restrictions: string | null;
  upgrade_price: number;
  purchase_balance_limit: string | null;
  sorting: number;
  display_status: boolean;
  open_state: boolean;
}

const LevelManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<UserLevel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    level_value: 888,
    withdrawal_restrictions: '',
    order_grabbing_restrictions: '',
    upgrade_price: 20.00,
    purchase_balance_limit: '',
    sorting: 100,
    display_status: true,
    open_state: true
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: levels, isLoading } = useQuery({
    queryKey: ['user-levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_levels')
        .select('*')
        .order('sorting', { ascending: true });
      
      if (error) throw error;
      return data as UserLevel[];
    },
  });

  const addLevelMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('user_levels')
        .insert(data);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-levels'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "成功",
        description: "等级已添加",
      });
    },
  });

  const deleteLevelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_levels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-levels'] });
      toast({
        title: "成功",
        description: "等级已删除",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      level_value: 888,
      withdrawal_restrictions: '',
      order_grabbing_restrictions: '',
      upgrade_price: 20.00,
      purchase_balance_limit: '',
      sorting: 100,
      display_status: true,
      open_state: true
    });
  };

  return (
    <AdminLayout title="等级管理">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>用户等级管理</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  添加等级
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>添加用户等级</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>等级名称</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="请输入等级名称"
                    />
                  </div>
                  <div>
                    <Label>等级值</Label>
                    <Input
                      type="number"
                      value={formData.level_value}
                      onChange={(e) => setFormData({...formData, level_value: parseInt(e.target.value) || 888})}
                    />
                  </div>
                  <div>
                    <Label>提现限制</Label>
                    <Textarea
                      value={formData.withdrawal_restrictions}
                      onChange={(e) => setFormData({...formData, withdrawal_restrictions: e.target.value})}
                      placeholder="请输入提现限制"
                    />
                  </div>
                  <div>
                    <Label>抢单限制</Label>
                    <Textarea
                      value={formData.order_grabbing_restrictions}
                      onChange={(e) => setFormData({...formData, order_grabbing_restrictions: e.target.value})}
                      placeholder="请输入抢单限制"
                    />
                  </div>
                  <div>
                    <Label>升级价格</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.upgrade_price}
                      onChange={(e) => setFormData({...formData, upgrade_price: parseFloat(e.target.value) || 20.00})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.display_status}
                      onCheckedChange={(checked) => setFormData({...formData, display_status: checked})}
                    />
                    <Label>显示状态</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.open_state}
                      onCheckedChange={(checked) => setFormData({...formData, open_state: checked})}
                    />
                    <Label>开放状态</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={() => addLevelMutation.mutate(formData)}>
                      添加
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>序号</TableHead>
                <TableHead>等级名称</TableHead>
                <TableHead>等级值</TableHead>
                <TableHead>升级价格</TableHead>
                <TableHead>提现限制</TableHead>
                <TableHead>抢单限制</TableHead>
                <TableHead>显示状态</TableHead>
                <TableHead>开放状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : levels?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                levels?.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell>{level.serial_number || '-'}</TableCell>
                    <TableCell className="font-medium">{level.name}</TableCell>
                    <TableCell>{level.level_value}</TableCell>
                    <TableCell>${level.upgrade_price.toFixed(2)}</TableCell>
                    <TableCell className="max-w-48 truncate">{level.withdrawal_restrictions || '-'}</TableCell>
                    <TableCell className="max-w-48 truncate">{level.order_grabbing_restrictions || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={level.display_status ? 'default' : 'secondary'}>
                        {level.display_status ? '显示' : '隐藏'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={level.open_state ? 'default' : 'secondary'}>
                        {level.open_state ? '开放' : '关闭'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteLevelMutation.mutate(level.id)}
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

export default LevelManagement;
