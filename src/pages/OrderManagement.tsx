
import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';

const OrderManagement = () => {
  return (
    <ProtectedRoute>
      <AdminLayout title="订单管理">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">订单列表</h2>
            <p className="text-gray-600">订单管理功能正在开发中...</p>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default OrderManagement;
