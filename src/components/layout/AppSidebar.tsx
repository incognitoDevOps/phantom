
import { 
  BarChart3, 
  Users, 
  ClipboardList, 
  ShoppingCart, 
  Package, 
  Settings, 
  TrendingUp,
  CreditCard,
  CircleDot,
  Gift,
  ReceiptText,
  Banknote,
  Calendar,
  FileText,
  DollarSign,
  Shield,
  UserCheck,
  MapPin,
  BookOpen,
  List,
  UserCog,
  Headphones,
  Activity,
  Building,
  Wallet,
  ArrowUpDown,
  Lock,
  User,
  Database
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    group: '仪表板',
    items: [
      { title: '概览', url: '/dashboard', icon: BarChart3 },
      { title: '数据统计', url: '/statistics', icon: TrendingUp },
    ]
  },
  {
    group: '用户管理',
    items: [
      { title: '用户管理', url: '/user-management', icon: Users },
      { title: '账单列表', url: '/bill-list', icon: FileText },
      { title: '提款记录', url: '/withdrawal-record', icon: CreditCard },
      { title: '充值列表', url: '/recharge-list', icon: DollarSign },
      { title: '支付列表', url: '/payment-list', icon: CreditCard },
      { title: '等级管理', url: '/level-management', icon: UserCheck },
      { title: '危险值记录', url: '/danger-value-record', icon: Shield },
      { title: '登录列表', url: '/login-list', icon: Users },
      { title: 'Navy地址', url: '/navy-address', icon: MapPin },
    ]
  },
  {
    group: '代理管理',
    items: [
      { title: '代理管理', url: '/agent-management', icon: UserCog },
      { title: '客服列表', url: '/customer-service', icon: Headphones },
    ]
  },
  {
    group: '营销中心',
    items: [
      { title: '活动管理', url: '/event-management', icon: Activity },
      { title: '转盘活动管理', url: '/lucky-wheel-management', icon: CircleDot },
      { title: '转盘抽奖记录', url: '/wheel-draw-record', icon: Calendar },
      { title: '优惠券管理', url: '/coupon-management', icon: Gift },
      { title: '优惠券发放记录', url: '/coupon-record', icon: ReceiptText },
      { title: '理财管理', url: '/financial-management', icon: Banknote },
    ]
  },
  {
    group: '支付管理',
    items: [
      { title: '支付商户管理', url: '/payment-merchant-management', icon: Building },
      { title: '支付渠道管理', url: '/payment-channel-management', icon: Wallet },
      { title: '代付渠道管理', url: '/payout-channel-management', icon: ArrowUpDown },
    ]
  },
  {
    group: '内容管理',
    items: [
      { title: '文章管理', url: '/article-management', icon: BookOpen },
      { title: '分类列表', url: '/category-list', icon: List },
    ]
  },
  {
    group: '系统管理',
    items: [
      { title: '角色管理', url: '/role-management', icon: Lock },
      { title: '管理员列表', url: '/administrator-management', icon: User },
      { title: '系统设置', url: '/system-settings', icon: Database },
    ]
  },
  {
    group: '业务管理',
    items: [
      { title: '任务管理', url: '/task-management', icon: ClipboardList },
      { title: '订单管理', url: '/order-management', icon: ShoppingCart },
      { title: '产品管理', url: '/product-management', icon: Package },
      { title: '解决方案组管理', url: '/solution-group-management', icon: Settings },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={`${isCollapsed ? "w-14" : "w-64"} bg-blue-500`} collapsible="icon">
      <SidebarContent className="bg-blue-500">
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className={`${isCollapsed ? "sr-only" : ""} text-white`}>
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-white hover:bg-blue-600 ${
                          isActive(item.url) 
                            ? 'bg-blue-600 font-medium' 
                            : 'hover:bg-blue-600'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
