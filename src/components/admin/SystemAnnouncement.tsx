
import React from 'react';

export const SystemAnnouncement: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">系统公告</h2>
      </div>
      
      <div className="p-6">
        <div className="text-gray-600 min-h-[400px]">
          {/* 这里是公告内容区域 */}
          <p className="text-center text-gray-400 mt-20">暂无公告内容</p>
        </div>
      </div>
    </div>
  );
};
