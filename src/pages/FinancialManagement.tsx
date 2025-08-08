
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Download, RefreshCw } from 'lucide-react';

interface FinancialOrder {
  id: string;
  username: string;
  order_number: string;
  product_name: string;
  purchase_amount: number;
  daily_income: number;
  current_income: number;
  fees: number;
  valid_days: number;
  revenue_time: number;
  return_principal_and_interest: number;
  order_status: string;
  buy_time: string;
  created_at: string;
}

interface FormData {
  username: string;
  order_number: string;
  product_name: string;
  purchase_amount: string;
  daily_income: string;
  valid_days: string;
  fees: string;
}

const FinancialManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    order_number: '',
    product_name: '',
    purchase_amount: '',
    daily_income: '',
    valid_days: '',
    fees: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['financial-orders', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('financial_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,order_number.ilike.%${searchTerm}%,product_name.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('order_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FinancialOrder[];
    },
  });

  const addOrderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const purchaseAmount = parseFloat(data.purchase_amount);
      const dailyIncome = parseFloat(data.daily_income);
      const validDays = parseInt(data.valid_days);
      const fees = parseFloat(data.fees);
      const returnAmount = purchaseAmount + (dailyIncome * validDays) - fees;

      const { error } = await supabase
        .from('financial_orders')
        .insert({
          username: data.username,
          order_number: data.order_number || `FO${Date.now()}`,
          product_name: data.product_name,
          purchase_amount: purchaseAmount,
          daily_income: dailyIncome,
          current_income: 0,
          fees: fees,
          valid_days: validDays,
          revenue_time: 0,
          return_principal_and_interest: returnAmount,
          order_status: 'active',
          user_id: '00000000-0000-0000-0000-000000000000' // 临时用户ID
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-orders'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "成功",
        description: "理财订单已添加",
      });
    },
  });

  const exportToCSV = () => {
    if (!orders) return;
    
    const headers = ['用户名', '订单号', '产品名称', '购买金额', '日收益', '当前收益', '手续费', '有效天数', '收益时间', '本息返还', '状态', '购买时间'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.username,
        order.order_number,
        order.product_name || '',
        order.purchase_amount,
        order.daily_income,
        order.current_income,
        order.fees,
        order.valid_days,
        order.revenue_time,
        order.return_principal_and_interest,
        order.order_status,
        new Date(order.buy_time).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      order_number: '',
      product_name: '',
      purchase_amount: '',
      daily_income: '',
      valid_days: '',
      fees: ''
    });
  };

  const totalAmount = orders?.reduce((sum, order) => sum + order.purchase_amount, 0) || 0;
  const totalIncome = orders?.reduce((sum, order) => sum + order.current_income, 0) || 0;
  const activeOrders = orders?.filter(order => order.order_status === 'active').length || 0;

  return (
    <AdminLayout title="理财管理">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">总投资金额</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">¥{totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">总收益</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">¥{totalIncome.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">活跃订单</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{activeOrders}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>理财订单管理</CardTitle>
              <div className="flex gap-2">
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新
                </Button>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-500 hover:bg-green-600">
                      <Plus className="w-4 h-4 mr-2" />
                      添加订单
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>添加理财订单</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>用户名</Label>
                        <Input
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          placeholder="请输入用户名"
                        />
                      </div>
                      <div>
                        <Label>订单号</Label>
                        <Input
                          value={formData.order_number}
                          onChange={(e) => setFormData({...formData, order_number: e.target.value})}
                          placeholder="留空自动生成"
                        />
                      </div>
                      <div>
                        <Label>产品名称</Label>
                        <Input
                          value={formData.product_name}
                          onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                          placeholder="请输入产品名称"
                        />
                      </div>
                      <div>
                        <Label>购买金额</Label>
                        <Input
                          type="number"
                          value={formData.purchase_amount}
                          onChange={(e) => setFormData({...formData, purchase_amount: e.target.value})}
                          placeholder="请输入购买金额"
                        />
                      </div>
                      <div>
                        <Label>日收益</Label>
                        <Input
                          type="number"
                          value={formData.daily_income}
                          onChange={(e) => setFormData({...formData, daily_income: e.target.value})}
                          placeholder="请输入日收益"
                        />
                      </div>
                      <div>
                        <Label>有效天数</Label>
                        <Input
                          type="number"
                          value={formData.valid_days}
                          onChange={(e) => setFormData({...formData, valid_days: e.target.value})}
                          placeholder="请输入有效天数"
                        />
                      </div>
                      <div>
                        <Label>手续费</Label>
                        <Input
                          type="number"
                          value={formData.fees}
                          onChange={(e) => setFormData({...formData, fees: e.target.value})}
                          placeholder="请输入手续费"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={() => addOrderMutation.mutate(formData)}>
                          添加
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索用户名、订单号或产品名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>订单号</TableHead>
                  <TableHead>产品名称</TableHead>
                  <TableHead>购买金额</TableHead>
                  <TableHead>日收益</TableHead>
                  <TableHead>当前收益</TableHead>
                  <TableHead>手续费</TableHead>
                  <TableHead>有效天数</TableHead>
                  <TableHead>本息返还</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>购买时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center">加载中...</TableCell>
                  </TableRow>
                ) : orders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  orders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.username}</TableCell>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{order.product_name || '-'}</TableCell>
                      <TableCell>¥{order.purchase_amount.toLocaleString()}</TableCell>
                      <TableCell>¥{order.daily_income.toLocaleString()}</TableCell>
                      <TableCell>¥{order.current_income.toLocaleString()}</TableCell>
                      <TableCell>¥{order.fees.toLocaleString()}</TableCell>
                      <TableCell>{order.valid_days}天</TableCell>
                      <TableCell>¥{order.return_principal_and_interest.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.order_status === 'active' ? 'default' : 
                          order.order_status === 'completed' ? 'secondary' : 'destructive'
                        }>
                          {order.order_status === 'active' ? '活跃' : 
                           order.order_status === 'completed' ? '已完成' : '已取消'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.buy_time).toLocaleString()}</TableCell>
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

export default FinancialManagement;
