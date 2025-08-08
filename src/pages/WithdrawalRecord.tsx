
import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const WithdrawalRecord = () => {
  // Mock data for demonstration
  const withdrawals = [
    { id: 1, amount: 800, date: '2024-01-15', status: 'Completed', method: 'Bank Transfer' },
    { id: 2, amount: 300, date: '2024-01-14', status: 'Processing', method: 'Digital Wallet' },
    { id: 3, amount: 1500, date: '2024-01-13', status: 'Completed', method: 'Bank Transfer' },
  ];

  return (
    <AdminLayout title="提款记录">
      <Card>
        <CardHeader>
          <CardTitle>提款记录</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>提款方式</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>#{withdrawal.id.toString().padStart(6, '0')}</TableCell>
                  <TableCell>¥{withdrawal.amount}</TableCell>
                  <TableCell>{withdrawal.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      withdrawal.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {withdrawal.status}
                    </span>
                  </TableCell>
                  <TableCell>{withdrawal.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default WithdrawalRecord;
