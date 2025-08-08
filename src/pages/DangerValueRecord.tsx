
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

interface DangerValueRecord {
  id: string;
  serial_number: number | null;
  username: string;
  type: string;
  value_at_risk: number;
  instructions: string | null;
  operation_time: string;
}

const DangerValueRecord = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: dangerRecords, isLoading } = useQuery({
    queryKey: ['danger-value-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('danger_value_records')
        .select('*')
        .order('operation_time', { ascending: false });
      
      if (error) throw error;
      return data as DangerValueRecord[];
    },
  });

  const filteredRecords = dangerRecords?.filter(record =>
    record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'High Risk':
        return 'bg-red-100 text-red-800';
      case 'Medium Risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low Risk':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="危险值记录">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>危险值记录</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索用户名或类型..."
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
                <TableHead>类型</TableHead>
                <TableHead>危险值</TableHead>
                <TableHead>说明</TableHead>
                <TableHead>操作时间</TableHead>
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
                    <TableCell>{record.serial_number || '-'}</TableCell>
                    <TableCell className="font-medium">{record.username}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(record.type)}>
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={record.value_at_risk >= 80 ? 'text-red-600' : record.value_at_risk >= 50 ? 'text-yellow-600' : 'text-green-600'}>
                        {record.value_at_risk}
                      </span>
                    </TableCell>
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

export default DangerValueRecord;
