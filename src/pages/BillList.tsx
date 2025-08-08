
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

interface BillRecord {
  id: string;
  username: string;
  order_number: string;
  type: string;
  previous_amount: number;
  operation_amount: number;
  after_amount: number;
  instructions: string | null;
  operation_time: string;
}

const BillList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: billRecords, isLoading } = useQuery({
    queryKey: ['bill-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bill_records')
        .select('*')
        .order('operation_time', { ascending: false });
      
      if (error) throw error;
      return data as BillRecord[];
    },
  });

  const filteredRecords = billRecords?.filter(record =>
    record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Commission for grabbing orders':
        return 'bg-green-100 text-green-800';
      case 'Free Gift':
        return 'bg-blue-100 text-blue-800';
      case 'Upgrade to VIP':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="账单列表">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>账单记录</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索用户名、订单号或类型..."
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
                <TableHead>订单编号</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>之前金额</TableHead>
                <TableHead>操作金额</TableHead>
                <TableHead>之后金额</TableHead>
                <TableHead>说明</TableHead>
                <TableHead>操作时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : filteredRecords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                filteredRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.username}</TableCell>
                    <TableCell>{record.order_number}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(record.type)}>
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>${record.previous_amount.toFixed(2)}</TableCell>
                    <TableCell className={record.operation_amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {record.operation_amount >= 0 ? '+' : ''}${record.operation_amount.toFixed(2)}
                    </TableCell>
                    <TableCell>${record.after_amount.toFixed(2)}</TableCell>
                    <TableCell className="max-w-48 truncate">{record.instructions || '-'}</TableCell>
                    <TableCell>{new Date(record.operation_time).toLocaleString()}</TableCell>
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

export default BillList;
