
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface LuckyWheelActivity {
  id: string;
  name: string;
  details: string;
  daily_draw_limit: number;
  total_draw_limit: number | null;
  free_draw_daily: boolean;
  is_active: boolean;
  created_at: string;
}

interface FormData {
  name: string;
  details: string;
  daily_draw_limit: number;
  total_draw_limit: string;
  free_draw_daily: boolean;
  is_active: boolean;
}

const LuckyWheelManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<LuckyWheelActivity | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    details: '',
    daily_draw_limit: 1,
    total_draw_limit: '',
    free_draw_daily: true,
    is_active: true
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['lucky-wheel-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lucky_wheel_activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LuckyWheelActivity[];
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase
        .from('lucky_wheel_activities')
        .insert({
          name: data.name,
          details: data.details,
          daily_draw_limit: data.daily_draw_limit,
          total_draw_limit: data.total_draw_limit ? parseInt(data.total_draw_limit) : null,
          free_draw_daily: data.free_draw_daily,
          is_active: data.is_active
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lucky-wheel-activities'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "成功",
        description: "转盘活动已添加",
      });
    },
  });

  const toggleActivityStatus = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('lucky_wheel_activities')
        .update({ is_active: !is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lucky-wheel-activities'] });
      toast({
        title: "成功",
        description: "活动状态已更新",
      });
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lucky_wheel_activities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lucky-wheel-activities'] });
      toast({
        title: "成功",
        description: "活动已删除",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      details: '',
      daily_draw_limit: 1,
      total_draw_limit: '',
      free_draw_daily: true,
      is_active: true
    });
  };

  return (
    <AdminLayout title="转盘活动管理">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>转盘活动列表</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  添加活动
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加转盘活动</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>活动名称</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="请输入活动名称"
                    />
                  </div>
                  <div>
                    <Label>活动详情</Label>
                    <Textarea
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      placeholder="请输入活动详情"
                    />
                  </div>
                  <div>
                    <Label>每日抽奖限制</Label>
                    <Input
                      type="number"
                      value={formData.daily_draw_limit}
                      onChange={(e) => setFormData({...formData, daily_draw_limit: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div>
                    <Label>总抽奖限制（可选）</Label>
                    <Input
                      type="number"
                      value={formData.total_draw_limit}
                      onChange={(e) => setFormData({...formData, total_draw_limit: e.target.value})}
                      placeholder="留空表示无限制"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.free_draw_daily}
                      onCheckedChange={(checked) => setFormData({...formData, free_draw_daily: checked})}
                    />
                    <Label>每日免费抽奖</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label>启用活动</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={() => addActivityMutation.mutate(formData)}>
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
                <TableHead>活动名称</TableHead>
                <TableHead>详情</TableHead>
                <TableHead>每日限制</TableHead>
                <TableHead>总限制</TableHead>
                <TableHead>免费抽奖</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : activities?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                activities?.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell className="max-w-48 truncate">{activity.details}</TableCell>
                    <TableCell>{activity.daily_draw_limit}</TableCell>
                    <TableCell>{activity.total_draw_limit || '无限制'}</TableCell>
                    <TableCell>
                      <Badge variant={activity.free_draw_daily ? 'default' : 'secondary'}>
                        {activity.free_draw_daily ? '是' : '否'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={activity.is_active ? 'default' : 'secondary'}>
                        {activity.is_active ? '活跃' : '停用'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(activity.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleActivityStatus.mutate({ 
                            id: activity.id, 
                            is_active: activity.is_active 
                          })}
                        >
                          {activity.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteActivity.mutate(activity.id)}
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

export default LuckyWheelManagement;
