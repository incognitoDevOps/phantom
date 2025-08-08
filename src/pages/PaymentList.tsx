
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

interface PaymentRecord {
  id: string;
  username: string;
  payment_order_number: string;
  bank_account_number: string | null;
  real_name: string | null;
  payment_status: string;
  user_type: string;
  payment_amount: number;
  payment_method: string | null;
  submission_time: string;
}

const PaymentList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: paymentRecords, isLoading } = useQuery({
    queryKey: ['payment-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_records')
        .select('*')
        .order('submission_time', { ascending: false });
      
      if (error) throw error;
      return data as PaymentRecord[];
    },
  });

  const filteredRecords = paymentRecords?.filter(record =>
    record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.payment_order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.real_name && record.real_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout title="支付列表">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>支付记录</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索用户名、订单号或真实姓名..."
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
                <TableHead>支付订单号</TableHead>
                <TableHead>银行账号</TableHead>
                <TableHead>真实姓名</TableHead>
                <TableHead>支付状态</TableHead>
                <TableHead>用户类型</TableHead>
                <TableHead>支付金额</TableHead>
                <TableHead>支付方式</TableHead>
                <TableHead>提交时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : filteredRecords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                filteredRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.username}</TableCell>
                    <TableCell>{record.payment_order_number}</TableCell>
                    <TableCell>{record.bank_account_number || '-'}</TableCell>
                    <TableCell>{record.real_name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={record.payment_status === 'completed' ? 'default' : 'secondary'}>
                        {record.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.user_type}</TableCell>
                    <TableCell>${record.payment_amount.toFixed(2)}</TableCell>
                    <TableCell>{record.payment_method || '-'}</TableCell>
                    <TableCell>{new Date(record.submission_time).toLocaleString()}</TableCell>
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

export default PaymentList;
