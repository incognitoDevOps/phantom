
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProtectedRoute } from "@/components/user/UserProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import UserDashboard from "./pages/UserDashboard";
import LandingPage from "./pages/LandingPage";
import UserOrder from "./pages/UserOrder";
import UserTask from "./pages/UserTask";
import UserService from "./pages/UserService";
import UserDeposit from "./pages/UserDeposit";
import UserProfile from "./pages/UserProfile";
import CompanyProfile from "./pages/CompanyProfile";
import WorkDescription from "./pages/WorkDescription";
import CompanyQualification from "./pages/CompanyQualification";
import TeamReport from "./pages/TeamReport";
import Withdraw from "./pages/Withdraw";
import WithdrawalsRecord from "./pages/WithdrawalsRecord";
import RechargeRecord from "./pages/RechargeRecord";
import TransactionRecord from "./pages/TransactionRecord";
import WithdrawalInformation from "./pages/WithdrawalInformation";
import Announcement from "./pages/Announcement";
import ManagePassword from "./pages/ManagePassword";
import AddBalance from "./pages/AddBalance";
import UserManagement from "./pages/UserManagement";
import TaskManagement from "./pages/TaskManagement";
import OrderManagement from "./pages/OrderManagement";
import ProductManagement from "./pages/ProductManagement";
import SolutionGroupManagement from "./pages/SolutionGroupManagement";
import Statistics from "./pages/Statistics";
import WithdrawalRecord from "./pages/WithdrawalRecord";
import WheelDrawRecord from "./pages/WheelDrawRecord";
import CouponManagement from "./pages/CouponManagement";
import CouponRecord from "./pages/CouponRecord";
import FinancialManagement from "./pages/FinancialManagement";
import LuckyWheelManagement from "./pages/LuckyWheelManagement";
import BillList from "./pages/BillList";
import RechargeList from "./pages/RechargeList";
import PaymentList from "./pages/PaymentList";
import LevelManagement from "./pages/LevelManagement";
import DangerValueRecord from "./pages/DangerValueRecord";
import LoginList from "./pages/LoginList";
import NavyAddress from "./pages/NavyAddress";
import ArticleManagement from "./pages/ArticleManagement";
import CategoryList from "./pages/CategoryList";
import AgentManagement from "./pages/AgentManagement";
import CustomerService from "./pages/CustomerService";
import EventManagement from "./pages/EventManagement";
import PaymentMerchantManagement from "./pages/PaymentMerchantManagement";
import PaymentChannelManagement from "./pages/PaymentChannelManagement";
import PayoutChannelManagement from "./pages/PayoutChannelManagement";
import RoleManagement from "./pages/RoleManagement";
import AdministratorManagement from "./pages/AdministratorManagement";
import SystemSettings from "./pages/SystemSettings";
import ChangePassword from "./pages/ChangePassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/dashboard" element={
            <UserProtectedRoute>
              <UserDashboard />
            </UserProtectedRoute>
          } />
          <Route path="/user/company-profile" element={
            <UserProtectedRoute>
              <CompanyProfile />
            </UserProtectedRoute>
          } />
          <Route path="/user/work-description" element={
            <UserProtectedRoute>
              <WorkDescription />
            </UserProtectedRoute>
          } />
          <Route path="/user/company-qualification" element={
            <UserProtectedRoute>
              <CompanyQualification />
            </UserProtectedRoute>
          } />
          <Route path="/user/order" element={
            <UserProtectedRoute>
              <UserOrder />
            </UserProtectedRoute>
          } />
          <Route path="/user/task" element={
            <UserProtectedRoute>
              <UserTask />
            </UserProtectedRoute>
          } />
          <Route path="/user/service" element={
            <UserProtectedRoute>
              <UserService />
            </UserProtectedRoute>
          } />
          <Route path="/user/profile" element={
            <UserProtectedRoute>
              <UserProfile />
            </UserProtectedRoute>
          } />
          <Route path="/user/add-balance" element={
            <UserProtectedRoute>
              <AddBalance />
            </UserProtectedRoute>
          } />
          <Route path="/user/team-report" element={
            <UserProtectedRoute>
              <TeamReport />
            </UserProtectedRoute>
          } />
          <Route path="/user/withdraw" element={
            <UserProtectedRoute>
              <Withdraw />
            </UserProtectedRoute>
          } />
          <Route path="/user/withdrawals-record" element={
            <UserProtectedRoute>
              <WithdrawalsRecord />
            </UserProtectedRoute>
          } />
          <Route path="/user/recharge-record" element={
            <UserProtectedRoute>
              <RechargeRecord />
            </UserProtectedRoute>
          } />
          <Route path="/user/transaction-record" element={
            <UserProtectedRoute>
              <TransactionRecord />
            </UserProtectedRoute>
          } />
          <Route path="/user/withdrawal-information" element={
            <UserProtectedRoute>
              <WithdrawalInformation />
            </UserProtectedRoute>
          } />
          <Route path="/user/announcement" element={
            <UserProtectedRoute>
              <Announcement />
            </UserProtectedRoute>
          } />
          <Route path="/user/manage-password" element={
            <UserProtectedRoute>
              <ManagePassword />
            </UserProtectedRoute>
          } />
          <Route path="/user/deposit" element={
            <UserProtectedRoute>
              <UserDeposit />
            </UserProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/task-management" element={<TaskManagement />} />
          <Route path="/order-management" element={<OrderManagement />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/solution-group-management" element={<SolutionGroupManagement />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/withdrawal-record" element={<WithdrawalRecord />} />
          <Route path="/wheel-draw-record" element={<WheelDrawRecord />} />
          <Route path="/coupon-management" element={<CouponManagement />} />
          <Route path="/coupon-record" element={<CouponRecord />} />
          <Route path="/financial-management" element={<FinancialManagement />} />
          <Route path="/lucky-wheel-management" element={<LuckyWheelManagement />} />
          <Route path="/bill-list" element={<BillList />} />
          <Route path="/recharge-list" element={<RechargeList />} />
          <Route path="/payment-list" element={<PaymentList />} />
          <Route path="/level-management" element={<LevelManagement />} />
          <Route path="/danger-value-record" element={<DangerValueRecord />} />
          <Route path="/login-list" element={<LoginList />} />
          <Route path="/navy-address" element={<NavyAddress />} />
          <Route path="/article-management" element={<ArticleManagement />} />
          <Route path="/category-list" element={<CategoryList />} />
          <Route path="/agent-management" element={<AgentManagement />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/event-management" element={<EventManagement />} />
          <Route path="/payment-merchant-management" element={<PaymentMerchantManagement />} />
          <Route path="/payment-channel-management" element={<PaymentChannelManagement />} />
          <Route path="/payout-channel-management" element={<PayoutChannelManagement />} />
          <Route path="/role-management" element={<RoleManagement />} />
          <Route path="/administrator-management" element={<AdministratorManagement />} />
          <Route path="/system-settings" element={<SystemSettings />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
