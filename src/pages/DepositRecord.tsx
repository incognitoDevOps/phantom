
import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DepositRecord = () => {
  // Mock data for demonstration
  const deposits = [
    { id: 1, amount: 1000, date: '2024-01-15', status: 'Completed', method: 'Bank Transfer' },
    { id: 2, amount: 500, date: '2024-01-14', status: 'Pending', method: 'Credit Card' },
    { id: 3, amount: 2000, date: '2024-01-13', status: 'Completed', method: 'Digital Wallet' },
  ];

  return (
    <AdminLayout title="充值记录">
      <Card>
        <CardHeader>
          <CardTitle>充值记录</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>支付方式</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>#{deposit.id.toString().padStart(6, '0')}</TableCell>
                  <TableCell>¥{deposit.amount}</TableCell>
                  <TableCell>{deposit.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      deposit.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {deposit.status}
                    </span>
                  </TableCell>
                  <TableCell>{deposit.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default DepositRecord;
