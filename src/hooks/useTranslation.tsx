import { createContext, useContext, useState, ReactNode } from 'react';

export interface Translations {
  // Header
  agoda: string;
  
  // Announcement
  announcementText: string;
  
  // Navigation
  home: string;
  task: string;
  order: string;
  mine: string;
  
  // Sections
  merchantList: string;
  transactionRecord: string;
  
  // Transaction types
  getUSDT: string;
  commission: string;
  payment: string;

  // Common UI elements
  welcome: string;
  login: string;
  logout: string;
  register: string;
  submit: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  confirm: string;
  back: string;
  next: string;
  loading: string;
  error: string;
  success: string;
  phoneNumber: string;
  password: string;
  email: string;
  username: string;
  balance: string;
  amount: string;
  status: string;
  date: string;
  time: string;
  search: string;
  filter: string;
  clear: string;
  selectLanguage: string;

  // Login & Registration
  loginTitle: string;
  loginDescription: string;
  registerTitle: string;
  registerDescription: string;
  loginSuccess: string;
  loginFailed: string;
  registerSuccess: string;
  registerFailed: string;
  phoneNumberRequired: string;
  passwordRequired: string;
  confirmPassword: string;
  passwordMismatch: string;
  accountExists: string;
  goToRegister: string;
  goToLogin: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;

  // Dashboard & Profile
  dashboard: string;
  profile: string;
  account: string;
  settings: string;
  personalInfo: string;
  accountBalance: string;
  recentTransactions: string;
  noTransactions: string;
  viewAll: string;
  depositMoney: string;
  withdrawMoney: string;
  transferMoney: string;
  
  // Tasks & Orders
  taskList: string;
  orderList: string;
  completedTasks: string;
  pendingTasks: string;
  completedOrders: string;
  pendingOrders: string;
  taskReward: string;
  orderAmount: string;
  noTasks: string;
  noOrders: string;
  
  // Service & Support
  customerService: string;
  contactUs: string;
  supportTicket: string;
  helpCenter: string;
  faq: string;
  livechat: string;
  
  // Hotels
  hotels: {
    hilton: {
      name: string;
      description: string;
    };
    ihg: {
      name: string;
      description: string;
    };
    marriott: {
      name: string;
      description: string;
    };
    accor: {
      name: string;
      description: string;
    };
    shangriLa: {
      name: string;
      description: string;
    };
    wyndham: {
      name: string;
      description: string;
    };
    hyatt: {
      name: string;
      description: string;
    };
    kempinski: {
      name: string;
      description: string;
    };
  };
}

const translations: Record<string, Translations> = {
  en: {
    agoda: 'agoda',
    announcementText: 'goda Mall, an online work mall under Agoda',
    home: 'Home',
    task: 'Task',
    order: 'Order',
    mine: 'Mine',
    merchantList: 'Merchant list',
    transactionRecord: 'Transaction record',
    getUSDT: 'Get USDT',
    commission: 'commission',
    payment: 'payment',

    // Common UI elements
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    phoneNumber: 'Phone number',
    password: 'Password',
    email: 'Email',
    username: 'Username',
    balance: 'Balance',
    amount: 'Amount',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    selectLanguage: 'Select Language',

    // Login & Registration
    loginTitle: 'Welcome back! 👋',
    loginDescription: 'Log in to your account',
    registerTitle: 'Create Account',
    registerDescription: 'Join our platform today',
    loginSuccess: 'Login Successful',
    loginFailed: 'Login Failed',
    registerSuccess: 'Registration Successful',
    registerFailed: 'Registration Failed',
    phoneNumberRequired: 'Phone number is required',
    passwordRequired: 'Password is required',
    confirmPassword: 'Confirm Password',
    passwordMismatch: 'Passwords do not match',
    accountExists: 'Account already exists',
    goToRegister: 'Go to register',
    goToLogin: 'Go to login',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',

    // Dashboard & Profile
    dashboard: 'Dashboard',
    profile: 'Profile',
    account: 'Account',
    settings: 'Settings',
    personalInfo: 'Personal Information',
    accountBalance: 'Account Balance',
    recentTransactions: 'Recent Transactions',
    noTransactions: 'No transactions found',
    viewAll: 'View All',
    depositMoney: 'Deposit',
    withdrawMoney: 'Withdraw',
    transferMoney: 'Transfer',
    
    // Tasks & Orders
    taskList: 'Task List',
    orderList: 'Order List',
    completedTasks: 'Completed Tasks',
    pendingTasks: 'Pending Tasks',
    completedOrders: 'Completed Orders',
    pendingOrders: 'Pending Orders',
    taskReward: 'Reward',
    orderAmount: 'Order Amount',
    noTasks: 'No tasks available',
    noOrders: 'No orders found',
    
    // Service & Support
    customerService: 'Customer Service',
    contactUs: 'Contact Us',
    supportTicket: 'Support Ticket',
    helpCenter: 'Help Center',
    faq: 'FAQ',
    livechat: 'Live Chat',

    hotels: {
      hilton: {
        name: 'Hilton',
        description: 'Hilton Hotels & Resorts is one of the world\'s most iconic and recognizable hospitality brands, renowned for it...'
      },
      ihg: {
        name: 'IHG',
        description: 'IHG Hotels & Resorts (InterContinental Hotels Group) is one of the world\'s leading hospitality companies...'
      },
      marriott: {
        name: 'Marriott International',
        description: 'Marriott International, founded in 1927 by J. Willard Marriott, is a global leader in the hospitality industry...'
      },
      accor: {
        name: 'Accor',
        description: 'Accor, founded in 1967 and headquartered in Paris, France, is one of the world\'s largest and most dynamic hospitali...'
      },
      shangriLa: {
        name: 'Shangri-La',
        description: 'Founded in 1971 by Malaysian tycoon Robert Kuok, Shangri-La is synonymous with refined luxury, cultural...'
      },
      wyndham: {
        name: 'Wyndham',
        description: 'Founded in 1981 and headquartered in Parsippany, New Jersey, USA, Wyndham Hotels & Resorts is a global...'
      },
      hyatt: {
        name: 'Hyatt',
        description: 'Hyatt has grown into a premier hospitality brand with over 1,300 properties across 76 countries. Known for it...'
      },
      kempinski: {
        name: 'Kempinski',
        description: 'Kempinski Hotels is one of the world\'s most storied luxury hospitality brands, blending rich European heritage wit...'
      }
    }
  },
  zh: {
    agoda: 'agoda',
    announcementText: 'goda购物中心，Agoda旗下的在线工作商城',
    home: '首页',
    task: '任务',
    order: '订单',
    mine: '我的',
    merchantList: '商家列表',
    transactionRecord: '交易记录',
    getUSDT: '获得 USDT',
    commission: '佣金',
    payment: '付款',

    // Common UI elements
    welcome: '欢迎',
    login: '登录',
    logout: '退出登录',
    register: '注册',
    submit: '提交',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    confirm: '确认',
    back: '返回',
    next: '下一步',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    phoneNumber: '手机号码',
    password: '密码',
    email: '邮箱',
    username: '用户名',
    balance: '余额',
    amount: '金额',
    status: '状态',
    date: '日期',
    time: '时间',
    search: '搜索',
    filter: '筛选',
    clear: '清除',
    selectLanguage: '选择语言',

    // Login & Registration
    loginTitle: '欢迎回来！👋',
    loginDescription: '登录您的账户',
    registerTitle: '创建账户',
    registerDescription: '立即加入我们的平台',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    registerSuccess: '注册成功',
    registerFailed: '注册失败',
    phoneNumberRequired: '手机号码不能为空',
    passwordRequired: '密码不能为空',
    confirmPassword: '确认密码',
    passwordMismatch: '密码不匹配',
    accountExists: '账户已存在',
    goToRegister: '前往注册',
    goToLogin: '前往登录',
    dontHaveAccount: '还没有账户？',
    alreadyHaveAccount: '已有账户？',

    // Dashboard & Profile
    dashboard: '仪表板',
    profile: '个人资料',
    account: '账户',
    settings: '设置',
    personalInfo: '个人信息',
    accountBalance: '账户余额',
    recentTransactions: '最近交易',
    noTransactions: '未找到交易记录',
    viewAll: '查看全部',
    depositMoney: '充值',
    withdrawMoney: '提现',
    transferMoney: '转账',
    
    // Tasks & Orders
    taskList: '任务列表',
    orderList: '订单列表',
    completedTasks: '已完成任务',
    pendingTasks: '待完成任务',
    completedOrders: '已完成订单',
    pendingOrders: '待处理订单',
    taskReward: '奖励',
    orderAmount: '订单金额',
    noTasks: '暂无可用任务',
    noOrders: '未找到订单',
    
    // Service & Support
    customerService: '客户服务',
    contactUs: '联系我们',
    supportTicket: '支持工单',
    helpCenter: '帮助中心',
    faq: '常见问题',
    livechat: '在线客服',

    hotels: {
      hilton: {
        name: '希尔顿',
        description: '希尔顿酒店及度假村是世界上最具标志性和知名度的酒店品牌之一，以其...'
      },
      ihg: {
        name: '洲际酒店集团',
        description: 'IHG洲际酒店集团是世界领先的酒店管理公司之一...'
      },
      marriott: {
        name: '万豪国际',
        description: '万豪国际成立于1927年，由J. Willard Marriott创立，是酒店业的全球领导者...'
      },
      accor: {
        name: '雅高',
        description: '雅高成立于1967年，总部位于法国巴黎，是世界上最大和最具活力的酒店集团之一...'
      },
      shangriLa: {
        name: '香格里拉',
        description: '香格里拉由马来西亚大亨郭鹤年于1971年创立，以精致奢华、文化传承而闻名...'
      },
      wyndham: {
        name: '温德姆',
        description: '温德姆酒店及度假村成立于1981年，总部位于美国新泽西州帕西帕尼，是一家全球性的...'
      },
      hyatt: {
        name: '凯悦',
        description: '凯悦已发展成为拥有76个国家1300多家酒店的顶级酒店品牌。以其卓越的...'
      },
      kempinski: {
        name: '凯宾斯基',
        description: '凯宾斯基酒店是世界上最具传奇色彩的奢华酒店品牌之一，融合了丰富的欧洲传统与...'
      }
    }
  }
};

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translations;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');
  
  const value = {
    language,
    setLanguage,
    t: translations[language] || translations.en,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};