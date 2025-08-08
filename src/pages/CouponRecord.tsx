
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Download, RefreshCw } from 'lucide-react';

const CouponRecord = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: couponRecords, isLoading, refetch } = useQuery({
    queryKey: ['coupon-records', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('coupon_records')
        .select(`
          *,
          coupons!inner(name, special_offers, coupon_type)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`coupon_code.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        if (statusFilter === 'used') {
          query = query.not('used_at', 'is', null);
        } else {
          query = query.is('used_at', null);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const exportToCSV = () => {
    if (!couponRecords) return;
    
    const headers = ['优惠券代码', '用户ID', '优惠券名称', '特殊优惠', '分发时间', '使用时间', '状态'];
    const csvContent = [
      headers.join(','),
      ...couponRecords.map(record => [
        record.coupon_code || '',
        record.user_id,
        record.coupons.name,
        record.coupons.special_offers || '',
        new Date(record.distribution_time || record.created_at).toLocaleString(),
        record.used_at ? new Date(record.used_at).toLocaleString() : '',
        record.used_at ? '已使用' : '未使用'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `coupon_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const usedCount = couponRecords?.filter(record => record.used_at).length || 0;
  const unusedCount = couponRecords?.filter(record => !record.used_at).length || 0;

  return (
    <AdminLayout title="优惠券发放记录">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">总发放数量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{couponRecords?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">已使用数量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{usedCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">未使用数量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{unusedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>优惠券发放记录</CardTitle>
              <div className="flex gap-2">
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新
                </Button>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索优惠券代码或用户ID..."
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
                  <SelectItem value="used">已使用</SelectItem>
                  <SelectItem value="unused">未使用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>优惠券代码</TableHead>
                  <TableHead>用户ID</TableHead>
                  <TableHead>优惠券名称</TableHead>
                  <TableHead>优惠券类型</TableHead>
                  <TableHead>特殊优惠</TableHead>
                  <TableHead>分发时间</TableHead>
                  <TableHead>使用时间</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">加载中...</TableCell>
                  </TableRow>
                ) : couponRecords?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  couponRecords?.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.coupon_code || record.id.slice(0, 8)}</TableCell>
                      <TableCell>{record.user_id.slice(0, 8)}...</TableCell>
                      <TableCell>{record.coupons.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {record.coupons.coupon_type === 'recharge' ? '充值券' : '其他'}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.coupons.special_offers || '-'}</TableCell>
                      <TableCell>
                        {new Date(record.distribution_time || record.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {record.used_at ? new Date(record.used_at).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.used_at ? 'default' : 'secondary'}>
                          {record.used_at ? '已使用' : '未使用'}
                        </Badge>
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

export default CouponRecord;
