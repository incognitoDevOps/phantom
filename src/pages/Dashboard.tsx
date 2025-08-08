
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, RotateCcw } from 'lucide-react';

interface TodoItem {
  id: string;
  user_id: string;
  username: string;
  withdrawal_order_number: string | null;
  name: string | null;
  phone_number: string | null;
  user_type: string | null;
  withdrawal_account_info: string | null;
  application_amount: number | null;
  amount_of_payment: number | null;
  balance: number | null;
  agent_review_status: string | null;
  withdrawal_time: string | null;
  operator: string | null;
  created_at: string | null;
}

const Dashboard = () => {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodoItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [todoItems, searchTerm, statusFilter, userTypeFilter]);

  const fetchTodoItems = async () => {
    try {
      const { data, error } = await supabase
        .from('todo_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "错误",
          description: "获取数据失败",
          variant: "destructive",
        });
        return;
      }

      setTodoItems(data || []);
    } catch (error) {
      console.error('Error fetching todo items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = todoItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.withdrawal_order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone_number?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.agent_review_status === statusFilter);
    }

    if (userTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.user_type === userTypeFilter);
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setUserTypeFilter('all');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string | null) => {
    const statusMap = {
      pending: { text: '待审核', class: 'bg-yellow-100 text-yellow-800' },
      approved: { text: '已通过', class: 'bg-green-100 text-green-800' },
      rejected: { text: '已拒绝', class: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { text: '未知', class: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const getUserTypeBadge = (type: string | null) => {
    const typeMap = {
      user: { text: '普通用户', class: 'bg-blue-100 text-blue-800' },
      vip: { text: 'VIP用户', class: 'bg-purple-100 text-purple-800' },
      agent: { text: '代理', class: 'bg-orange-100 text-orange-800' }
    };
    
    const typeInfo = typeMap[type as keyof typeof typeMap] || { text: '普通用户', class: 'bg-blue-100 text-blue-800' };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${typeInfo.class}`}>
        {typeInfo.text}
      </span>
    );
  };

  const formatCurrency = (amount: number | null) => {
    return amount ? `¥${amount.toFixed(2)}` : '¥0.00';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <AdminLayout title="待办事项">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">加载中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="待办事项">
      <Card>
        <CardContent className="p-6">
          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">搜索</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜索用户名、订单号、姓名或手机号"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="min-w-[150px]">
                <label className="block text-sm font-medium mb-2">审核状态</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待审核</SelectItem>
                    <SelectItem value="approved">已通过</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="min-w-[150px]">
                <label className="block text-sm font-medium mb-2">用户类型</label>
                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="user">普通用户</SelectItem>
                    <SelectItem value="vip">VIP用户</SelectItem>
                    <SelectItem value="agent">代理</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={resetFilters} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              共找到 {filteredItems.length} 条记录
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">用户ID</TableHead>
                  <TableHead className="font-semibold">用户名</TableHead>
                  <TableHead className="font-semibold">提现单号</TableHead>
                  <TableHead className="font-semibold">姓名</TableHead>
                  <TableHead className="font-semibold">手机号</TableHead>
                  <TableHead className="font-semibold">用户类型</TableHead>
                  <TableHead className="font-semibold">提现账户信息</TableHead>
                  <TableHead className="font-semibold">申请金额</TableHead>
                  <TableHead className="font-semibold">到账金额</TableHead>
                  <TableHead className="font-semibold">余额</TableHead>
                  <TableHead className="font-semibold">代理审核状态</TableHead>
                  <TableHead className="font-semibold">提现时间</TableHead>
                  <TableHead className="font-semibold">操作员</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">{item.user_id}</TableCell>
                      <TableCell className="font-medium">{item.username}</TableCell>
                      <TableCell className="font-mono text-sm">{item.withdrawal_order_number || '-'}</TableCell>
                      <TableCell>{item.name || '-'}</TableCell>
                      <TableCell className="font-mono">{item.phone_number || '-'}</TableCell>
                      <TableCell>{getUserTypeBadge(item.user_type)}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={item.withdrawal_account_info || ''}>
                        {item.withdrawal_account_info || '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.application_amount)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.amount_of_payment)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.balance)}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.agent_review_status)}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(item.withdrawal_time)}
                      </TableCell>
                      <TableCell>{item.operator || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => paginate(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
