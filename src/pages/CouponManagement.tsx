
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Coupon {
  id: string;
  name: string;
  coupon_type: string;
  special_offers: string;
  issue_quantity: number;
  valid_days: number;
  open_state: boolean;
  sorting: number;
  created_at: string;
}

interface FormData {
  name: string;
  coupon_type: string;
  special_offers: string;
  issue_quantity: string;
  valid_days: string;
  open_state: boolean;
  sorting: number;
}

const CouponManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    coupon_type: 'recharge',
    special_offers: '',
    issue_quantity: '',
    valid_days: '',
    open_state: true,
    sorting: 0
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('sorting', { ascending: false });
      
      if (error) throw error;
      return data as Coupon[];
    },
  });

  const addCouponMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase
        .from('coupons')
        .insert({
          name: data.name,
          coupon_type: data.coupon_type,
          special_offers: data.special_offers,
          issue_quantity: parseInt(data.issue_quantity) || null,
          valid_days: parseInt(data.valid_days) || null,
          open_state: data.open_state,
          sorting: data.sorting
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "成功",
        description: "优惠券已添加",
      });
    },
  });

  const toggleCouponStatus = useMutation({
    mutationFn: async ({ id, open_state }: { id: string; open_state: boolean }) => {
      const { error } = await supabase
        .from('coupons')
        .update({ open_state: !open_state })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast({
        title: "成功",
        description: "优惠券状态已更新",
      });
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast({
        title: "成功",
        description: "优惠券已删除",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      coupon_type: 'recharge',
      special_offers: '',
      issue_quantity: '',
      valid_days: '',
      open_state: true,
      sorting: 0
    });
  };

  return (
    <AdminLayout title="优惠券管理">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>优惠券列表</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  添加优惠券
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加优惠券</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>优惠券名称</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="请输入优惠券名称"
                    />
                  </div>
                  <div>
                    <Label>优惠券类型</Label>
                    <Select value={formData.coupon_type} onValueChange={(value) => setFormData({...formData, coupon_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recharge">充值券</SelectItem>
                        <SelectItem value="discount">折扣券</SelectItem>
                        <SelectItem value="cashback">返现券</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>特殊优惠</Label>
                    <Input
                      value={formData.special_offers}
                      onChange={(e) => setFormData({...formData, special_offers: e.target.value})}
                      placeholder="请输入特殊优惠内容"
                    />
                  </div>
                  <div>
                    <Label>发行数量</Label>
                    <Input
                      type="number"
                      value={formData.issue_quantity}
                      onChange={(e) => setFormData({...formData, issue_quantity: e.target.value})}
                      placeholder="留空表示无限制"
                    />
                  </div>
                  <div>
                    <Label>有效天数</Label>
                    <Input
                      type="number"
                      value={formData.valid_days}
                      onChange={(e) => setFormData({...formData, valid_days: e.target.value})}
                      placeholder="留空表示永久有效"
                    />
                  </div>
                  <div>
                    <Label>排序</Label>
                    <Input
                      type="number"
                      value={formData.sorting}
                      onChange={(e) => setFormData({...formData, sorting: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.open_state}
                      onCheckedChange={(checked) => setFormData({...formData, open_state: checked})}
                    />
                    <Label>启用状态</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={() => addCouponMutation.mutate(formData)}>
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
                <TableHead>优惠券名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>特殊优惠</TableHead>
                <TableHead>发行数量</TableHead>
                <TableHead>有效天数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>排序</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : coupons?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                coupons?.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {coupon.coupon_type === 'recharge' ? '充值券' : 
                         coupon.coupon_type === 'discount' ? '折扣券' : '返现券'}
                      </Badge>
                    </TableCell>
                    <TableCell>{coupon.special_offers || '-'}</TableCell>
                    <TableCell>{coupon.issue_quantity || '无限制'}</TableCell>
                    <TableCell>{coupon.valid_days || '永久'}</TableCell>
                    <TableCell>
                      <Badge variant={coupon.open_state ? 'default' : 'secondary'}>
                        {coupon.open_state ? '启用' : '停用'}
                      </Badge>
                    </TableCell>
                    <TableCell>{coupon.sorting}</TableCell>
                    <TableCell>{new Date(coupon.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleCouponStatus.mutate({ 
                            id: coupon.id, 
                            open_state: coupon.open_state 
                          })}
                        >
                          {coupon.open_state ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteCoupon.mutate(coupon.id)}
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

export default CouponManagement;
