
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
import { useToast } from '@/hooks/use-toast';

const WheelDrawRecord = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const { toast } = useToast();

  const { data: drawRecords, isLoading, refetch } = useQuery({
    queryKey: ['wheel-draw-records', searchTerm, activityFilter],
    queryFn: async () => {
      let query = supabase
        .from('wheel_draw_records')
        .select('*')
        .order('draw_time', { ascending: false });

      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,order_number.ilike.%${searchTerm}%`);
      }

      if (activityFilter !== 'all') {
        query = query.eq('activity_name', activityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: activities } = useQuery({
    queryKey: ['lucky-wheel-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lucky_wheel_activities')
        .select('name')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  const exportToCSV = () => {
    if (!drawRecords) return;
    
    const headers = ['订单号', '用户名', '活动名称', '奖品名称', '中奖金额', '抽奖时间', '支付金额'];
    const csvContent = [
      headers.join(','),
      ...drawRecords.map(record => [
        record.order_number,
        record.username || '',
        record.activity_name || '',
        record.prize_name || '',
        record.winning_amount || 0,
        new Date(record.draw_time).toLocaleString(),
        record.payment_amount || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wheel_draw_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalWinnings = drawRecords?.reduce((sum, record) => sum + (record.winning_amount || 0), 0) || 0;
  const totalPayments = drawRecords?.reduce((sum, record) => sum + (record.payment_amount || 0), 0) || 0;

  return (
    <AdminLayout title="转盘抽奖记录">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">总抽奖次数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{drawRecords?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">总中奖金额</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">¥{totalWinnings.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">总支付金额</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">¥{totalPayments.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>抽奖记录</CardTitle>
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
                  placeholder="搜索用户名或订单号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="选择活动" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部活动</SelectItem>
                  {activities?.map((activity) => (
                    <SelectItem key={activity.name} value={activity.name}>
                      {activity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>用户名</TableHead>
                  <TableHead>活动名称</TableHead>
                  <TableHead>奖品名称</TableHead>
                  <TableHead>中奖信息</TableHead>
                  <TableHead>中奖金额</TableHead>
                  <TableHead>支付金额</TableHead>
                  <TableHead>抽奖时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">加载中...</TableCell>
                  </TableRow>
                ) : drawRecords?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  drawRecords?.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.order_number}</TableCell>
                      <TableCell>{record.username}</TableCell>
                      <TableCell>{record.activity_name}</TableCell>
                      <TableCell>{record.prize_name}</TableCell>
                      <TableCell>
                        <Badge variant={record.winning_amount > 0 ? 'default' : 'secondary'}>
                          {record.winning_info || (record.winning_amount > 0 ? '中奖' : '未中奖')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={record.winning_amount > 0 ? 'text-green-600 font-medium' : ''}>
                          ¥{record.winning_amount?.toFixed(2) || '0.00'}
                        </span>
                      </TableCell>
                      <TableCell>¥{record.payment_amount?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>{new Date(record.draw_time).toLocaleString()}</TableCell>
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

export default WheelDrawRecord;
