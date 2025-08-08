
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Download } from 'lucide-react';

interface LoginRecord {
  id: string;
  serial_number: number | null;
  username: string;
  login_ip: string | null;
  login_address: string | null;
  login_date: string;
}

const LoginList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: loginRecords, isLoading } = useQuery({
    queryKey: ['login-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('login_records')
        .select('*')
        .order('login_date', { ascending: false });
      
      if (error) throw error;
      return data as LoginRecord[];
    },
  });

  const filteredRecords = loginRecords?.filter(record =>
    record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.login_ip && record.login_ip.includes(searchTerm)) ||
    (record.login_address && record.login_address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout title="登录列表">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>登录记录</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索用户名、IP或地址..."
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
                <TableHead>序号</TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>登录IP</TableHead>
                <TableHead>登录地址</TableHead>
                <TableHead>登录时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : filteredRecords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                filteredRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.serial_number || '-'}</TableCell>
                    <TableCell className="font-medium">{record.username}</TableCell>
                    <TableCell>{record.login_ip || '-'}</TableCell>
                    <TableCell>{record.login_address || '-'}</TableCell>
                    <TableCell>{new Date(record.login_date).toLocaleString()}</TableCell>
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

export default LoginList;
