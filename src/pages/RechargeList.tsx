
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Download } from 'lucide-react';

interface RechargeRecord {
  id: string;
  username: string;
  merchant_order_number: string;
  payment_methods: string;
  recharge_amount: number;
  recharge_status: string;
  recharge_time: string;
}

const RechargeList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: rechargeRecords, isLoading } = useQuery({
    queryKey: ['recharge-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recharge_records')
        .select('*')
        .order('recharge_time', { ascending: false });
      
      if (error) throw error;
      return data as RechargeRecord[];
    },
  });

  const filteredRecords = rechargeRecords?.filter(record =>
    record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.merchant_order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="充值列表">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>充值记录</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索用户名或订单号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户名</TableHead>
                <TableHead>商户订单号</TableHead>
                <TableHead>支付方式</TableHead>
                <TableHead>充值金额</TableHead>
                <TableHead>充值状态</TableHead>
                <TableHead>充值时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : filteredRecords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                filteredRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.username}</TableCell>
                    <TableCell>{record.merchant_order_number}</TableCell>
                    <TableCell>{record.payment_methods}</TableCell>
                    <TableCell className="text-green-600">${record.recharge_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={record.recharge_status === 'Paid' ? 'default' : 'secondary'}>
                        {record.recharge_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(record.recharge_time).toLocaleString()}</TableCell>
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

export default RechargeList;
