
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, Plus, Edit, Trash2 } from 'lucide-react';

interface NavyAddress {
  id: string;
  consignee: string;
  contact_number: string;
  delivery_address: string;
  nation: string;
  postal_code: string | null;
  province_city_county: string | null;
  detailed_address: string | null;
  user_type: string;
  is_internal: boolean;
  creation_time: string;
}

const NavyAddress = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    consignee: '',
    contact_number: '',
    delivery_address: '',
    nation: 'Is',
    postal_code: '',
    province_city_county: '',
    detailed_address: '',
    user_type: 'user',
    is_internal: true
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['navy-addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navy_addresses')
        .select('*')
        .order('creation_time', { ascending: false });
      
      if (error) throw error;
      return data as NavyAddress[];
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('navy_addresses')
        .insert(data);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navy-addresses'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "成功",
        description: "地址已添加",
      });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('navy_addresses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navy-addresses'] });
      toast({
        title: "成功",
        description: "地址已删除",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      consignee: '',
      contact_number: '',
      delivery_address: '',
      nation: 'Is',
      postal_code: '',
      province_city_county: '',
      detailed_address: '',
      user_type: 'user',
      is_internal: true
    });
  };

  const filteredAddresses = addresses?.filter(address =>
    address.consignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.contact_number.includes(searchTerm) ||
    address.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Navy地址">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Navy地址管理</CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索收货人、电话或地址..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Plus className="w-4 h-4 mr-2" />
                    添加地址
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加Navy地址</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>收货人</Label>
                      <Input
                        value={formData.consignee}
                        onChange={(e) => setFormData({...formData, consignee: e.target.value})}
                        placeholder="请输入收货人姓名"
                      />
                    </div>
                    <div>
                      <Label>联系电话</Label>
                      <Input
                        value={formData.contact_number}
                        onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                        placeholder="请输入联系电话"
                      />
                    </div>
                    <div>
                      <Label>配送地址</Label>
                      <Input
                        value={formData.delivery_address}
                        onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
                        placeholder="请输入配送地址"
                      />
                    </div>
                    <div>
                      <Label>国家</Label>
                      <Input
                        value={formData.nation}
                        onChange={(e) => setFormData({...formData, nation: e.target.value})}
                        placeholder="请输入国家"
                      />
                    </div>
                    <div>
                      <Label>邮政编码</Label>
                      <Input
                        value={formData.postal_code}
                        onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                        placeholder="请输入邮政编码"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.is_internal}
                        onCheckedChange={(checked) => setFormData({...formData, is_internal: checked})}
                      />
                      <Label>内部地址</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={() => addAddressMutation.mutate(formData)}>
                        添加
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>收货人</TableHead>
                <TableHead>联系电话</TableHead>
                <TableHead>配送地址</TableHead>
                <TableHead>国家</TableHead>
                <TableHead>邮政编码</TableHead>
                <TableHead>省市县</TableHead>
                <TableHead>用户类型</TableHead>
                <TableHead>内部地址</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">加载中...</TableCell>
                </TableRow>
              ) : filteredAddresses?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">暂无数据</TableCell>
                </TableRow>
              ) : (
                filteredAddresses?.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell className="font-medium">{address.consignee}</TableCell>
                    <TableCell>{address.contact_number}</TableCell>
                    <TableCell className="max-w-48 truncate">{address.delivery_address}</TableCell>
                    <TableCell>{address.nation}</TableCell>
                    <TableCell>{address.postal_code || '-'}</TableCell>
                    <TableCell>{address.province_city_county || '-'}</TableCell>
                    <TableCell>{address.user_type}</TableCell>
                    <TableCell>
                      <Badge variant={address.is_internal ? 'default' : 'secondary'}>
                        {address.is_internal ? '是' : '否'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(address.creation_time).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteAddressMutation.mutate(address.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
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

export default NavyAddress;
