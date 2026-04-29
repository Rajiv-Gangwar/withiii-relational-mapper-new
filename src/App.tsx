/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Users, 
  Settings, 
  BarChart3, 
  Bell, 
  Search, 
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  MoreVertical,
  Mail,
  Link as LinkIcon,
  QrCode,
  ArrowLeft,
  Info,
  Menu,
  X,
  LogOut,
  Pencil,
  Trash2,
  Building2,
  UserPlus,
  PlusCircle,
  ShieldCheck,
  UserCheck,
  Send,
  Upload,
  Share2,
  Network,
  UploadCloud
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Types & Mock Data ---
import { User, UserRole, RelationalMap, Relationship, MapType, PermissionGroup } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com', role: 'Withiii Host', department: 'Actiknow', departmentName: 'Executive', title: 'CEO', avatar: 'https://picsum.photos/seed/alex/100' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'Facilitator', department: 'BCG', departmentName: 'Consulting', title: 'Senior Consultant', avatar: 'https://picsum.photos/seed/sarah/100' },
  { id: '3', name: 'Michael Scott', email: 'michael@example.com', role: 'Department Lead', department: 'Salesforce', departmentName: 'Sales', title: 'Regional Manager', avatar: 'https://picsum.photos/seed/michael/100' },
  { id: '4', name: 'Pam Beesly', email: 'pam@example.com', role: 'Team Lead', department: 'Altassian', departmentName: 'Product', title: 'Office Administrator', avatar: 'https://picsum.photos/seed/pam/100' },
  { id: '5', name: 'Jim Halpert', email: 'jim@example.com', role: 'Individual User', department: 'Stripe', departmentName: 'Marketing', title: 'Sales Representative', avatar: 'https://picsum.photos/seed/jim/100' },
  { id: '6', name: 'Dwight Schrute', email: 'dwight@example.com', role: 'Individual User', department: 'Squarespace', departmentName: 'Engineering', title: 'Assistant Regional Manager', avatar: 'https://picsum.photos/seed/dwight/100' },
  { id: '7', name: 'Angela Martin', email: 'angela@example.com', role: 'Individual User', department: 'Actiknow', departmentName: 'Finance', title: 'Head of Accounting', avatar: 'https://picsum.photos/seed/angela/100' },
  { id: '8', name: 'Kelly Kapoor', email: 'kelly@example.com', role: 'Individual User', department: 'Actiknow', departmentName: 'Marketing', title: 'Customer Service Rep', avatar: 'https://picsum.photos/seed/kelly/100' },
];

const MOCK_MAPS: RelationalMap[] = [
  { id: 'm1', name: 'Sales Team Q1', type: 'Team', description: 'Q1 alignment for the sales team.', orgMapType: 'Team', mode: 'Online', deadline: '2024-04-01', participants: ['4', '5', '6'], viewers: 12, includeIdeal: true, status: 'Active', createdAt: '2024-03-01', participationRate: 85, owner: 'Current User', coOwned: false, participated: true, shared: false },
  { id: 'm2', name: 'Org-wide Alignment', type: 'Organization', organizationName: 'Acme Corp', description: 'Annual alignment map for the entire organization.', orgMapType: 'Department', mode: 'Offline', facilitatorName: 'Sarah Chen', deadline: '2024-05-15', participants: ['1', '2', '3', '4', '5', '6'], viewers: 45, includeIdeal: true, status: 'Draft', createdAt: '2024-03-15', participationRate: 0, owner: 'Current User', coOwned: true, participated: false, shared: false },
  { id: 'm3', name: 'My Personal Network', type: 'Individual', ownerId: '1', category: 'Work', participants: ['1', '2'], viewers: 5, includeIdeal: false, status: 'Active', createdAt: '2024-03-16', participationRate: 100, owner: 'Current User', coOwned: false, participated: false, shared: false },
  { id: 'm4', name: 'Marketing Strategy', type: 'Team', description: 'Strategy for Q2.', orgMapType: 'Team', mode: 'Online', deadline: '2024-06-01', participants: ['1', '4'], viewers: 8, includeIdeal: true, status: 'Active', createdAt: '2024-03-20', participationRate: 60, owner: 'Other User', coOwned: false, participated: true, shared: false },
  { id: 'm5', name: 'Product Roadmap', type: 'Organization', organizationName: 'Acme Corp', description: 'Product roadmap for 2024.', orgMapType: 'Department', mode: 'Offline', facilitatorName: 'John Doe', deadline: '2024-12-31', participants: ['1', '2', '3'], viewers: 20, includeIdeal: true, status: 'Active', createdAt: '2024-01-01', participationRate: 40, owner: 'Other User', coOwned: false, participated: false, shared: true },
  { id: 'm6', name: 'Past Project Review', type: 'Team', description: 'Review of the previous project.', orgMapType: 'Team', mode: 'Online', deadline: '2023-12-31', participants: ['1', '2', '3'], viewers: 10, includeIdeal: true, status: 'Completed', createdAt: '2023-11-01', participationRate: 100, owner: 'Other User', coOwned: false, participated: true, shared: false },
];

const MOCK_RELATIONSHIPS: Relationship[] = [
  { fromId: '5', toId: '4', current: 1, goal: 2, lastUpdated: '2024-03-10' },
  { fromId: '6', toId: '4', current: -1, goal: 2, lastUpdated: '2024-03-11' },
  { fromId: '5', toId: '6', current: 0, goal: 1, lastUpdated: '2024-03-12' },
];

const ANALYTICS_DATA = [
  { name: 'Jan', current: -0.5, goal: 1.5 },
  { name: 'Feb', current: 0.2, goal: 1.5 },
  { name: 'Mar', current: 0.8, goal: 1.5 },
  { name: 'Apr', current: 1.1, goal: 1.7 },
];

const MAPS_CREATED_DATA = [
  { name: 'Jan', Organization: 12, Team: 24, Individual: 45 },
  { name: 'Feb', Organization: 15, Team: 28, Individual: 52 },
  { name: 'Mar', Organization: 18, Team: 32, Individual: 60 },
  { name: 'Apr', Organization: 22, Team: 36, Individual: 68 },
  { name: 'May', Organization: 25, Team: 40, Individual: 75 },
  { name: 'Jun', Organization: 30, Team: 45, Individual: 85 },
];

const USER_ROLES_DATA = [
  { name: 'Withiii Hosts', value: 12, color: '#300a73' },
  { name: 'Subhosts', value: 24, color: '#eab948' },
  { name: 'Client Hosts', value: 45, color: '#ec4899' },
  { name: 'Individuals (Linked)', value: 850, color: '#10b981' },
  { name: 'Individuals (Unlinked)', value: 320, color: '#f59e0b' },
  { name: 'Team Leads', value: 120, color: '#6366f1' },
  { name: 'Department Leads', value: 45, color: '#14b8a6' },
  { name: 'Facilitators', value: 85, color: '#f43f5e' },
];

const USERS_GROWTH_DATA = [
  { name: 'Jan', users: 1240 },
  { name: 'Feb', users: 1350 },
  { name: 'Mar', users: 1500 },
  { name: 'Apr', users: 1800 },
  { name: 'May', users: 2200 },
  { name: 'Jun', users: 2800 },
];

// --- Components ---

const Logo = ({ className = "h-10" }: { className?: string }) => (
  <img 
    src="https://static.wixstatic.com/media/d80662_71336a61378844bd8f426f1e0609ee8b~mv2.png/v1/fill/w_280,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Withiii%20logo%20Illustrator%20copy%20revised%201%20with%20leadership%20only.png" 
    alt="Withiii Leadership" 
    className={cn("w-auto object-contain", className)}
    referrerPolicy="no-referrer"
  />
);

const Sidebar = ({ 
  activeScreen, 
  setScreen, 
  isOpen, 
  setIsOpen 
}: { 
  activeScreen: string, 
  setScreen: (s: string) => void,
  isOpen: boolean,
  setIsOpen: (o: boolean) => void
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'maps', label: 'Maps', icon: MapIcon },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'facilitators', label: 'Facilitators', icon: UserCheck },
    { id: 'subhosts', label: 'Sub Hosts', icon: Users },
    { id: 'users', label: 'Users', icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={false}
        animate={{ 
          width: isOpen ? 256 : 80,
          x: 0 
        }}
        className={cn(
          "h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-[70] transition-all duration-300 ease-in-out overflow-hidden shrink-0",
          !isOpen && "lg:w-20",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-[70]",
          !isOpen && "max-lg:-translate-x-full"
        )}
      >
        <div className={cn("p-6 flex items-center min-h-[80px]", isOpen ? "justify-between" : "justify-center")}>
          <div className={cn("transition-all duration-300 overflow-hidden", !isOpen && "opacity-0 w-0 hidden")}>
            <Logo className="h-8" />
          </div>
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-primary-light rounded-xl text-gray-500 hover:text-primary transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-primary outline-none"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar" aria-label="Main Navigation">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setScreen(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative focus-visible:ring-2 focus-visible:ring-primary outline-none",
                activeScreen === item.id 
                  ? "bg-primary-light text-primary font-medium" 
                  : "text-gray-600 hover:bg-primary-light hover:text-secondary"
              )}
              aria-current={activeScreen === item.id ? "page" : undefined}
              title={!isOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span className={cn(
                "transition-all duration-300 whitespace-nowrap overflow-hidden",
                !isOpen && "lg:opacity-0 lg:w-0"
              )}>
                {item.label}
              </span>
              {!isOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-secondary text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap hidden lg:block" aria-hidden="true">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button 
            type="button"
            onClick={() => {
              setScreen('profile');
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-light cursor-pointer transition-colors group relative focus-visible:ring-2 focus-visible:ring-primary outline-none",
              !isOpen && "lg:justify-center"
            )}
            aria-label="View Profile"
            aria-current={activeScreen === 'profile' ? "page" : undefined}
          >
            <div className="w-10 h-10 rounded-full border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center bg-gray-50">
              <img src={MOCK_USERS[0].avatar} className="w-full h-full object-cover" alt="Your avatar" referrerPolicy="no-referrer" />
            </div>
            <div className={cn(
              "flex-1 min-w-0 transition-all duration-300 text-left",
              !isOpen && "lg:opacity-0 lg:w-0 lg:hidden"
            )}>
              <p className="text-sm font-semibold truncate group-hover:text-secondary">{MOCK_USERS[0].name}</p>
              <p className="text-xs text-gray-600 truncate">{MOCK_USERS[0].role}</p>
            </div>
            {!isOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-secondary text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap hidden lg:block" aria-hidden="true">
                {MOCK_USERS[0].name}
              </div>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
};

const Header = ({ 
  title, 
  onLogout, 
  isGuest, 
  isSidebarOpen, 
  setIsSidebarOpen 
}: { 
  title: string, 
  onLogout: () => void, 
  isGuest?: boolean,
  isSidebarOpen?: boolean,
  setIsSidebarOpen?: (o: boolean) => void
}) => (
  <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
    <div className="flex items-center gap-4">
      {!isGuest && (
        <button 
          type="button"
          onClick={() => setIsSidebarOpen?.(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 lg:hidden focus-visible:ring-2 focus-visible:ring-primary outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
      <h1 className="text-base lg:text-lg font-semibold text-secondary truncate max-w-[200px] sm:max-w-none">{title}</h1>
    </div>
    <button 
      type="button"
      onClick={onLogout}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-bold text-xs group focus-visible:ring-2 focus-visible:ring-primary outline-none",
        isGuest ? "text-primary bg-primary-light hover:bg-primary/10" : "text-[#411876] hover:bg-[#411876]/5"
      )}
      aria-label={isGuest ? "Back to Login" : "Logout"}
      title={isGuest ? "Back to Login" : "Logout"}
    >
      {isGuest ? <ArrowLeft className="w-4 h-4" aria-hidden="true" /> : <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
      <span className="hidden sm:inline">{isGuest ? 'Back to Login' : 'Logout'}</span>
    </button>
  </header>
);

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      role="alert"
      aria-live="assertive"
      className={cn(
        "fixed bottom-8 left-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]",
        type === 'success' ? "bg-green-600 text-white" : "bg-red-600 text-white"
      )}
    >
      {type === 'success' ? <CheckCircle2 className="w-5 h-5" aria-hidden="true" /> : <AlertCircle className="w-5 h-5" aria-hidden="true" />}
      <p className="text-sm font-bold">{message}</p>
      <button type="button" onClick={onClose} className="ml-auto p-1 hover:bg-white/20 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none" aria-label="Dismiss notification">
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
};

// --- Screen Components ---

const LoginScreen = ({ onLogin, onGuest }: { onLogin: () => void, onGuest: () => void }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignup = () => {
    setSignupSuccess(true);
  };

  if (signupSuccess) {
    return (
      <div className="h-screen flex bg-white overflow-hidden">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full mx-auto text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                <Mail className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-3">Check Your Email</h2>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              We've sent an email to your address with your login credentials and instructions on how to access your account.
            </p>
            <button 
              type="button"
              onClick={() => {
                setSignupSuccess(false);
                setIsSignup(false);
              }} 
              className="btn-primary w-full py-2.5 text-base focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              Back to Login
            </button>
          </motion.div>
        </div>
        <div className="hidden lg:block lg:w-1/2 relative bg-secondary overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/d/1c4_ler6geYm2OOstsjZJTv_P_XiWfUxx" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Relational Mapping"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden" role="main">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-8">
        <motion.div 
          key={isSignup ? 'signup' : 'login'}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-8">
            <div className="mb-6">
              <Logo className="h-10" />
            </div>
            <h2 className="text-3xl font-bold text-secondary mb-1">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-gray-600">
              {isSignup ? 'Start mapping your relationships today.' : 'Map your relationships, unlock your potential.'}
            </p>
          </div>
          
          <div className="space-y-4">
            {isSignup && (
              <div>
                <label htmlFor="signup-name" className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
                <input id="signup-name" type="text" placeholder="John Doe" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" />
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
              <input id="login-email" type="email" placeholder="name@company.com" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" />
            </div>
            {isSignup && (
              <div>
                <label htmlFor="signup-phone" className="block text-xs font-medium text-gray-700 mb-1.5">Phone Number <span className="text-gray-600 font-normal">(Optional)</span></label>
                <input id="signup-phone" type="tel" placeholder="+1 (555) 000-0000" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" />
              </div>
            )}
            {!isSignup && (
              <div>
                <label htmlFor="login-password" className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
                <input id="login-password" type="password" placeholder="••••••••" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" />
                <div className="mt-1.5 text-right">
                  <a href="#" className="text-xs text-primary hover:underline font-medium focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">Forgot Password?</a>
                </div>
              </div>
            )}
            
            <div className="pt-2 space-y-3">
              <button 
                type="button"
                onClick={isSignup ? handleSignup : onLogin} 
                className="btn-primary w-full py-2.5 text-base shadow-lg shadow-accent/20 focus-visible:ring-2 focus-visible:ring-accent outline-none"
              >
                {isSignup ? 'Sign Up' : 'Sign In'}
              </button>
              {!isSignup && (
                <button 
                  type="button"
                  onClick={onGuest} 
                  className="btn-outline w-full py-2.5 text-base focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  Create Map as a Guest
                </button>
              )}
            </div>
          </div>
          
          <p className="mt-8 text-center text-xs text-gray-600">
            {isSignup ? (
              <>Already have an account? <button type="button" onClick={() => setIsSignup(false)} className="text-primary font-bold hover:underline focus-visible:ring-2 focus-visible:ring-primary outline-none rounded px-1">Sign In</button></>
            ) : (
              <>Don't have an account? <button type="button" onClick={() => setIsSignup(true)} className="text-primary font-bold hover:underline focus-visible:ring-2 focus-visible:ring-primary outline-none rounded px-1">Sign up for free</button></>
            )}
          </p>
        </motion.div>
      </div>

      {/* Right Side: Graphic */}
      <div className="hidden lg:block lg:w-1/2 relative bg-secondary overflow-hidden">
        <img 
          src="https://lh3.googleusercontent.com/d/1c4_ler6geYm2OOstsjZJTv_P_XiWfUxx" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Relational Mapping"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

const Dashboard = ({ onAction }: { onAction: (action: string) => void }) => {
  const stats = [
    { id: 'organizations', label: 'Total Organizations', value: '24', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'maps', label: 'Owned Maps', value: '156', icon: MapIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'maps', label: 'Shared Maps', value: '89', icon: LinkIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'users', label: 'Total Individual Users', value: '1,240', icon: UserIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'facilitators', label: 'Facilitators', value: '42', icon: UserCheck, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'subhosts', label: 'Sub Hosts', value: '8', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const quickActions = [
    { id: 'create-map', label: 'Create a Map', icon: PlusCircle, color: 'bg-primary', action: () => onAction('create-map') },
    { id: 'add-org', label: 'Add Organization', icon: Building2, color: 'bg-blue-600', action: () => onAction('organizations-add') },
    { id: 'add-facilitator', label: 'Add Facilitator', icon: UserPlus, color: 'bg-pink-600', action: () => onAction('facilitators-add') },
    { id: 'add-subhost', label: 'Add Sub Host', icon: Users, color: 'bg-indigo-600', action: () => onAction('subhosts-add') },
    { id: 'add-user', label: 'Add User', icon: UserIcon, color: 'bg-emerald-600', action: () => onAction('users-add') },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4" role="group" aria-label="Quick actions">
        {quickActions.map((action, i) => (
          <button
            key={action.id}
            type="button"
            onClick={action.action}
            className="card p-4 flex items-center gap-3 hover:border-primary/50 transition-all group text-left focus-visible:ring-2 focus-visible:ring-primary outline-none"
            aria-label={action.label}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200", action.color)} aria-hidden="true">
              <action.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-secondary group-hover:text-primary transition-colors">{action.label}</p>
              <p className="text-[10px] text-gray-600">Quick access</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" role="group" aria-label="Key statistics">
        {stats.map((stat, i) => (
          <motion.button 
            key={i}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onAction(stat.id)}
            className="card p-4 flex items-center gap-4 hover:border-primary/50 transition-all text-left focus-visible:ring-2 focus-visible:ring-primary outline-none"
            aria-label={`View ${stat.label}: ${stat.value}`}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)} aria-hidden="true">
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-0.5">{stat.label}</p>
              <h3 className="text-2xl font-bold text-secondary">{stat.value}</h3>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-secondary">Organization Growth</h3>
            <select className="bg-gray-50 border-none rounded-lg text-xs px-2 py-1 outline-none">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} domain={[-2, 2]} ticks={[-2, -1, 0, 1, 2]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="current" stroke="#8a5fbb" strokeWidth={2} dot={{ r: 3, fill: '#8a5fbb' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-secondary">Maps Created</h3>
            <select className="bg-gray-50 border-none rounded-lg text-xs px-2 py-1 outline-none">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MAPS_CREATED_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Organization" stackId="a" fill="#300a73" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Team" stackId="a" fill="#eab948" />
                <Bar dataKey="Individual" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-secondary">Users by Role</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={USER_ROLES_DATA}
                  cx="40%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="75%"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {USER_ROLES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-secondary">Users Growth</h3>
            <select className="bg-gray-50 border-none rounded-lg text-xs px-2 py-1 outline-none">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={USERS_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="users" stroke="#300a73" strokeWidth={2} dot={{ r: 3, fill: '#300a73' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapView = ({ map, onBack, onReRate }: { map: RelationalMap, onBack: () => void, onReRate?: (map: RelationalMap) => void }) => {
  const owner = MOCK_USERS.find(u => u.id === map.ownerId);
  const participants = MOCK_USERS.filter(u => map.participants.includes(u.id));

  // Calculate ratings for individual map
  const ratingsGiven = MOCK_RELATIONSHIPS.filter(r => r.fromId === map.ownerId);
  const ratingsReceived = MOCK_RELATIONSHIPS.filter(r => r.toId === map.ownerId);

  // Calculate ratings for org map (just mock data for charts)
  const orgRatingsData = [
    { name: 'Alex', current: 1, target: 2 },
    { name: 'Sarah', current: 0, target: 1 },
    { name: 'Michael', current: 2, target: 2 },
    { name: 'Pam', current: -1, target: 1 },
  ];

  const orgMatrixData = [
    { from: 'Sales', to: 'IT', rating: -0.5 },
    { from: 'Sales', to: 'Finance', rating: 1.0 },
    { from: 'Sales', to: 'Data Analytics', rating: 1.0 },
    { from: 'IT', to: 'Sales', rating: 1.5 },
    { from: 'IT', to: 'Finance', rating: -1.5 },
    { from: 'IT', to: 'Data Analytics', rating: 0 },
    { from: 'Finance', to: 'Sales', rating: 1.0 },
    { from: 'Finance', to: 'IT', rating: -0.5 },
    { from: 'Finance', to: 'Data Analytics', rating: 1.5 },
    { from: 'Data Analytics', to: 'Sales', rating: 1.67 },
    { from: 'Data Analytics', to: 'IT', rating: 0.33 },
    { from: 'Data Analytics', to: 'Finance', rating: 0.67 },
  ];
  
  const departments = ['Sales', 'IT', 'Finance', 'Data Analytics'];

  const getRatingColor = (rating: number) => {
    if (rating > 0) return 'bg-emerald-200';
    if (rating < 0) return 'bg-red-200';
    return 'bg-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Maps
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-secondary flex items-center gap-2 text-xs focus-visible:ring-2 focus-visible:ring-primary outline-none">
            <UserPlus className="w-3.5 h-3.5" aria-hidden="true" /> Add Viewers
          </button>
          <button type="button" className="btn-primary flex items-center gap-2 text-xs focus-visible:ring-2 focus-visible:ring-primary outline-none">
            <Share2 className="w-3.5 h-3.5" aria-hidden="true" /> Share
          </button>
        </div>
      </div>

      {map.type === 'Individual' ? (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-secondary">{owner?.name || 'Unknown'}'s Map</h2>
              <button 
                type="button"
                onClick={() => onReRate?.(map)}
                className="btn-outline py-1.5 px-4 text-xs flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
              >
                <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" /> Re-rate Map
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md font-medium">Category: {map.category || 'Personal'}</span>
              <span>{participants.length} Participants</span>
              <span>{map.viewers || 0} Viewers</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-secondary mb-4">Ratings Given</h3>
              <div className="space-y-4">
                {ratingsGiven.map(r => {
                  const toUser = MOCK_USERS.find(u => u.id === r.toId);
                  return (
                    <div key={r.toId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={toUser?.avatar} alt={`${toUser?.name}'s avatar`} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                        <span className="font-medium text-sm">{toUser?.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div><span className="text-gray-500 text-xs">Actual:</span> <span className="font-bold">{r.current}</span></div>
                        <div><span className="text-gray-500 text-xs">Target:</span> <span className="font-bold">{r.goal}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-secondary mb-4">Ratings Received</h3>
              <div className="space-y-4">
                {ratingsReceived.map(r => {
                  const fromUser = MOCK_USERS.find(u => u.id === r.fromId);
                  return (
                    <div key={r.fromId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={fromUser?.avatar} alt={`${fromUser?.name}'s avatar`} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                        <span className="font-medium text-sm">{fromUser?.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div><span className="text-gray-500 text-xs">Actual:</span> <span className="font-bold">{r.current}</span></div>
                        <div><span className="text-gray-500 text-xs">Target:</span> <span className="font-bold">{r.goal}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-secondary mb-4">Relationship Network</h3>
            <NetworkGraph data={{
              nodes: [
                { id: 'main', name: owner?.name || 'You', isMain: true },
                ...participants.map(p => {
                  const rating = ratingsGiven.find(r => r.toId === p.id);
                  return { id: p.id, name: p.name, score: rating?.current };
                })
              ],
              links: participants.map(p => {
                const rating = ratingsGiven.find(r => r.toId === p.id);
                return {
                  source: 'main',
                  target: p.id,
                  value: rating?.current ?? 0
                };
              })
            }} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-2">{map.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{map.description || 'No description provided.'}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">{map.status}</span>
                <button 
                  type="button"
                  onClick={() => onReRate?.(map)}
                  className="btn-outline py-1.5 px-4 text-xs flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" /> Re-rate Map
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="font-medium text-sm">{map.orgMapType || 'Team'} Map</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Mode</p>
                <p className="font-medium text-sm">{map.mode || 'Online'}</p>
              </div>
              {map.mode === 'Offline' && map.facilitatorName && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Facilitator</p>
                  <p className="font-medium text-sm">{map.facilitatorName}</p>
                </div>
              )}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Deadline</p>
                <p className="font-medium text-sm">{map.deadline || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold text-secondary mb-6">Ratings Overview</h3>
                <div className="h-[300px] mb-8" role="img" aria-label="Scatter chart showing ratings overview. X-axis is current rating, Y-axis is target rating.">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="current" type="number" domain={[-2, 2]} ticks={[-2, -1, 0, 1, 2]} name="Current Rating" tick={{fontSize: 12, fill: '#6b7280'}} />
                      <YAxis dataKey="target" type="number" domain={[-2, 2]} ticks={[-2, -1, 0, 1, 2]} name="Target Rating" tick={{fontSize: 12, fill: '#6b7280'}} />
                      <ZAxis dataKey="name" type="category" name="Participant" />
                      <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <ReferenceLine x={0} stroke="#cbd5e1" />
                      <ReferenceLine y={0} stroke="#cbd5e1" />
                      <Scatter name="Ratings" data={orgRatingsData} fill="#300a73" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-600 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 rounded-tl-lg">Participant</th>
                        <th scope="col" className="px-4 py-3">Current Rating</th>
                        <th scope="col" className="px-4 py-3 rounded-tr-lg">Target Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orgRatingsData.map((data, index) => (
                        <tr key={index} className="border-b border-gray-50 last:border-0">
                          <th scope="row" className="px-4 py-3 font-medium text-secondary">{data.name}</th>
                          <td className="px-4 py-3">{data.current}</td>
                          <td className="px-4 py-3">{data.target}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold text-secondary mb-6">Relationship Network</h3>
                <NetworkGraph data={{
                  nodes: [
                    { id: 'main', name: owner?.name || 'You', isMain: true },
                    ...participants.map(p => {
                      const rating = ratingsGiven.find(r => r.toId === p.id);
                      return { id: p.id, name: p.name, score: rating?.current };
                    })
                  ],
                  links: participants.map(p => {
                    const rating = ratingsGiven.find(r => r.toId === p.id);
                    return {
                      source: 'main',
                      target: p.id,
                      value: rating?.current ?? 0
                    };
                  })
                }} />
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold text-secondary mb-4">Understanding The Scores</h3>
                <p className="text-sm text-gray-600 mb-4">Your average score reflects the mix of the following realities in your individual relationships:</p>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <h4 className="font-bold text-red-700 mb-2">-2</h4>
                    <p className="text-sm text-gray-600">You (and/or the other) are feeling held back or obstructed in the relationship and experience a profound lack of trust.</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <h4 className="font-bold text-orange-700 mb-2">-1</h4>
                    <p className="text-sm text-gray-600">You (and/or the other) are feeling unheard or feel that any success (or happiness) comes in spite of the other.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-2">0</h4>
                    <p className="text-sm text-gray-600">You (and/or the other) don’t pay too much attention to what the other is doing or to one’s impact on the other.</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-blue-700 mb-2">1</h4>
                    <p className="text-sm text-gray-600">You (and/or the other) actively help each other in ways that are appreciated.</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <h4 className="font-bold text-emerald-700 mb-2">2</h4>
                    <p className="text-sm text-gray-600">You (and/or the other) care as much about the other’s success as one's own and promote the other's success in all efforts.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6 h-fit">
              <h3 className="text-lg font-bold text-secondary mb-4">Participants ({participants.length})</h3>
              <div className="space-y-3">
                {participants.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <img src={p.avatar} alt={`${p.name}'s avatar`} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-medium text-sm text-secondary">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.title ? `${p.title} • ` : ''}{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapCard = ({ map, onClick, statusOverride, onReRate }: { map: RelationalMap, onClick: () => void, statusOverride?: string, onReRate?: (map: RelationalMap) => void, key?: string }) => {
  const status = statusOverride || map.status;
  
  const getStatusStyles = (s: string) => {
    switch (s) {
      case 'Active': return 'bg-green-50 text-green-600';
      case 'Draft': return 'bg-gray-50 text-gray-600';
      case 'Completed': return 'bg-blue-50 text-blue-600';
      case 'Pending': return 'bg-red-50 text-red-600';
      case 'Awaiting Rating': return 'bg-amber-50 text-amber-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={onClick} 
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="card group cursor-pointer hover:border-primary/50 transition-all p-4 text-left w-full focus-visible:ring-2 focus-visible:ring-primary outline-none"
      aria-label={`View details for ${map.name} map`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-8 h-8 bg-primary-light text-primary rounded-lg flex items-center justify-center" aria-hidden="true">
          <MapIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-end">
          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold uppercase", getStatusStyles(status))}>
            {status}
          </span>
          <span className="text-[10px] text-gray-500 mt-1">v1.2</span>
        </div>
      </div>
      <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">{map.name}</h3>
      <div className="flex items-center gap-2 mb-3">
        <span className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
          map.type === 'Organization' ? "bg-blue-50 text-blue-600" :
          map.type === 'Team' ? "bg-purple-50 text-purple-600" :
          "bg-emerald-50 text-emerald-600"
        )}>
          {map.type === 'Individual' ? 'Personal' : map.type} Map
        </span>
        {map.type === 'Organization' && map.organizationName && (
          <span className="text-[10px] text-gray-600 flex items-center gap-1 line-clamp-1">
            <Building2 className="w-3 h-3 shrink-0" aria-hidden="true" />
            {map.organizationName}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2" aria-hidden="true">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] font-bold">
                {i}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-gray-500">{map.participants.length} participants</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <UserIcon className="w-3 h-3" aria-hidden="true" />
          <span>12 Viewers</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Users className="w-3 h-3" aria-hidden="true" />
          <span>{map.viewers || 0} Viewers</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" 
            title="Re-rate"
            onClick={(e) => { e.stopPropagation(); onReRate?.(map); }}
            aria-label="Re-rate this map"
          >
            <BarChart3 className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          </button>
          <button 
            type="button"
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" 
            title="Add Viewers"
            onClick={(e) => { e.stopPropagation(); }}
            aria-label="Add viewers to this map"
          >
            <UserPlus className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
          </button>
          <button 
            type="button"
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" 
            title="Share"
            onClick={(e) => { e.stopPropagation(); }}
            aria-label="Share this map"
          >
            <Share2 className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MapsScreen = ({ onAddMap, onReRate }: { onAddMap: () => void, onReRate: (map: RelationalMap) => void }) => {
  const [activeTab, setActiveTab] = useState('my-maps');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMap, setSelectedMap] = useState<RelationalMap | null>(null);

  const pendingCounts = {
    'my-maps': MOCK_MAPS.filter(m => (m.owner === 'Current User' || m.coOwned) && m.status === 'Draft').length,
    'participated': MOCK_MAPS.filter(m => m.participated && m.status === 'Active').length,
    'shared': MOCK_MAPS.filter(m => m.shared && m.status === 'Active').length,
  };

  const tabs = [
    { id: 'my-maps', label: 'Owned' },
    { id: 'participated', label: 'Participated' },
    { id: 'shared', label: 'Shared with Me' },
  ];

  const filteredMaps = MOCK_MAPS.filter(map => {
    const matchesSearch = map.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'my-maps') return matchesSearch && (map.owner === 'Current User' || map.coOwned);
    if (activeTab === 'participated') return matchesSearch && map.participated;
    if (activeTab === 'shared') return matchesSearch && map.shared;
    return matchesSearch;
  });

  const toRateMaps = filteredMaps.filter(m => activeTab === 'participated' && m.status === 'Active');
  const historyMaps = filteredMaps.filter(m => activeTab === 'participated' && m.status === 'Completed');

  if (selectedMap) {
    return <MapView map={selectedMap} onBack={() => setSelectedMap(null)} onReRate={onReRate} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-6 border-b border-gray-100 w-full max-w-2xl" role="tablist" aria-label="Map Categories">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-xs font-bold transition-all relative uppercase tracking-wider flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none",
                activeTab === tab.id ? "text-primary" : "text-gray-600 hover:text-gray-800"
              )}
            >
              {tab.label}
              {pendingCounts[tab.id as keyof typeof pendingCounts] > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold leading-none"
                  aria-label={`${pendingCounts[tab.id as keyof typeof pendingCounts]} pending`}
                >
                  {pendingCounts[tab.id as keyof typeof pendingCounts]}
                </motion.span>
              )}
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" aria-hidden="true" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <label htmlFor="maps-search" className="sr-only">Search maps</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <input 
              id="maps-search"
              type="text" 
              placeholder="Search maps..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 py-1.5 w-48 focus-visible:ring-2 focus-visible:ring-primary outline-none" 
            />
          </div>
          <button type="button" onClick={onAddMap} className="btn-primary flex items-center gap-2 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary outline-none">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Create Map
          </button>
        </div>
      </div>

      <div id={`${activeTab}-panel`} role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
        {activeTab === 'participated' ? (
          <div className="space-y-10">
            <section aria-labelledby="needs-rating-heading">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-red-500" aria-hidden="true" />
                <h2 id="needs-rating-heading" className="text-sm font-bold text-secondary uppercase tracking-wider">Needs Rating</h2>
                <span className="ml-2 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold">{toRateMaps.length}</span>
              </div>
              {toRateMaps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {toRateMaps.map(map => (
                    <MapCard key={map.id} map={map} onClick={() => setSelectedMap(map)} statusOverride="Pending" onReRate={onReRate} />
                  ))}
                </div>
              ) : (
                <div className="card p-8 border-dashed border-2 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-8 h-8 text-gray-200 mb-2" aria-hidden="true" />
                  <p className="text-sm text-gray-500 font-medium">All caught up! No maps awaiting rating.</p>
                </div>
              )}
            </section>

            <hr className="border-gray-100" aria-hidden="true" />

            <section aria-labelledby="history-heading">
              <h2 id="history-heading" className="sr-only">Completed Maps</h2>
              {historyMaps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {historyMaps.map(map => (
                    <MapCard key={map.id} map={map} onClick={() => setSelectedMap(map)} onReRate={onReRate} />
                  ))}
                </div>
              ) : (
                <div className="card p-8 border-dashed border-2 flex flex-col items-center justify-center text-center">
                  <Clock className="w-8 h-8 text-gray-200 mb-2" aria-hidden="true" />
                  <p className="text-sm text-gray-500 font-medium">No completed maps in your history.</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMaps.map(map => (
              <MapCard key={map.id} map={map} onClick={() => setSelectedMap(map)} onReRate={onReRate} />
            ))}
            {activeTab === 'my-maps' && (
              <button 
                type="button"
                onClick={onAddMap}
                className="card border-dashed border-2 border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-primary/30 hover:text-primary transition-all min-h-[140px] focus-visible:ring-2 focus-visible:ring-primary outline-none"
                aria-label="Create New Map"
              >
                <Plus className="w-6 h-6" aria-hidden="true" />
                <span className="text-xs font-bold">Create New Map</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const OrganizationsScreen = ({ initialShowAdd = false }: { initialShowAdd?: boolean }) => {
  const [showAddModal, setShowAddModal] = useState(initialShowAdd);
  const [modalStep, setModalStep] = useState(1);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [orgs, setOrgs] = useState([
    { name: 'Dunder Mifflin', admin: 'Michael Scott', email: 'michael@dm.com', facilitator: 'Toby Flenderson', status: 'Active', date: '2024-01-15' },
    { name: 'Stark Industries', admin: 'Tony Stark', email: 'tony@stark.com', facilitator: 'Pepper Potts', status: 'Active', date: '2024-02-01' },
    { name: 'Wayne Corp', admin: 'Bruce Wayne', email: 'bruce@wayne.com', facilitator: 'Alfred Pennyworth', status: 'Deactivated', date: '2023-11-20' },
  ]);

  const handleAddOrg = () => {
    try {
      // Mock validation
      const success = Math.random() > 0.1; // 90% success rate for demo
      if (!success) throw new Error("Validation failed");

      setOrgs([...orgs, {
        name: 'New Organization',
        admin: 'New Admin',
        email: 'admin@new.com',
        facilitator: 'Toby Flenderson',
        status: 'Active',
        date: new Date().toISOString().split('T')[0]
      }]);
      setShowAddModal(false);
      setModalStep(1);
      setDepartments([]);
      setNewDeptName('');
      setToast({ message: 'Organization added successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to add organization. Please try again.', type: 'error' });
    }
  };

  const permissionCategories = [
    { id: 'org', label: 'Organization Permissions', items: ['Create departments'] },
    { id: 'user', label: 'User Management Permissions', items: ['Create users', 'Bulk upload users (organization)', 'Manage users', 'Assign user roles'] },
    { id: 'map-create', label: 'Map Creation Permissions', items: ['Create organizational maps', 'Create team maps', 'Create individual maps'] },
    { id: 'map-manage', label: 'Map Management Permissions', items: ['Launch maps', 'Invite participants', 'Bulk upload participants (map)', 'Send reminders'] },
    { id: 'map-collab', label: 'Map Collaboration Permissions', items: ['Share maps/Add co-owners', 'View map visibility'] },
    { id: 'rating', label: 'Rating Permissions', items: ['Override scores', 'Re-open ratings'] },
    { id: 'analytics', label: 'Analytics Permissions', items: ['Track relational changes over time'] },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <label htmlFor="org-search" className="sr-only">Search organizations</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <input id="org-search" type="text" placeholder="Search organizations..." className="input-field pl-9 py-1.5 focus-visible:ring-2 focus-visible:ring-primary outline-none" />
          </div>
          <button type="button" className="btn-outline flex items-center gap-2 py-1.5 focus-visible:ring-2 focus-visible:ring-primary outline-none"><Filter className="w-3.5 h-3.5" aria-hidden="true" /> Filter</button>
        </div>
        <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"><Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add Organization</button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-org-title">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 id="add-org-title" className="text-xl font-bold text-secondary">Add New Organization</h3>
                  <div className="flex items-center gap-2 mt-1" aria-hidden="true">
                    <div className={cn("w-2 h-2 rounded-full", modalStep === 1 ? "bg-primary" : "bg-gray-200")} />
                    <div className={cn("w-2 h-2 rounded-full", modalStep === 2 ? "bg-primary" : "bg-gray-200")} />
                    <div className={cn("w-2 h-2 rounded-full", modalStep === 3 ? "bg-primary" : "bg-gray-200")} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                      Step {modalStep} of 3: {
                        modalStep === 1 ? 'Organization Details' : 
                        modalStep === 2 ? 'Departments' : 'Roles & Permissions'
                      }
                    </span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setModalStep(1);
                  }} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {modalStep === 1 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="org-name" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Organization Name</label>
                          <input id="org-name" type="text" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="e.g. Acme Corp" />
                        </div>
                        <div>
                          <label htmlFor="admin-name" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Admin Name</label>
                          <input id="admin-name" type="text" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="e.g. John Doe" />
                        </div>
                        <div>
                          <label htmlFor="admin-email" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Email Address</label>
                          <input id="admin-email" type="email" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="admin@acme.com" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="facilitator-select" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Assign Facilitator</label>
                          <select id="facilitator-select" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none">
                            <option>Select Facilitator</option>
                            <option>Toby Flenderson</option>
                            <option>Pepper Potts</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="license-count" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Number of Licenses</label>
                          <input id="license-count" type="number" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="e.g. 50" />
                        </div>
                        <div>
                          <label htmlFor="logo-upload" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Organization Logo</label>
                          <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                            <p className="text-[10px] text-gray-400 font-medium">Click to upload or drag and drop</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : modalStep === 2 ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-secondary flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Add Departments (Optional)
                      </h4>
                      <p className="text-xs text-gray-500">You can add departments for this organization now, or skip this step.</p>
                      
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          className="input-field max-w-sm focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                          placeholder="Department Name (e.g. Engineering)"
                          value={newDeptName}
                          onChange={(e) => setNewDeptName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newDeptName.trim()) {
                                setDepartments([...departments, newDeptName.trim()]);
                                setNewDeptName('');
                              }
                            }
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            if (newDeptName.trim()) {
                              setDepartments([...departments, newDeptName.trim()]);
                              setNewDeptName('');
                            }
                          }}
                          className="btn-secondary px-4 py-2"
                        >
                          Add
                        </button>
                      </div>

                      <div className="space-y-2 max-w-sm">
                        {departments.map((dept, index) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={index} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group"
                          >
                            <span className="text-sm font-medium text-gray-700">{dept}</span>
                            <button 
                              type="button"
                              onClick={() => setDepartments(departments.filter((_, i) => i !== index))}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                        {departments.length === 0 && (
                          <p className="text-xs text-gray-400 italic py-4">No departments added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-secondary flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Role Permissions Configuration
                      </h4>
                      <p className="text-xs text-gray-500">Define what each role within this organization can see and do.</p>
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Permissions</th>
                              <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-center">Dept Lead</th>
                              <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-center">Team Lead</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {permissionCategories.map((cat) => (
                              <React.Fragment key={cat.id}>
                                <tr className="bg-gray-50/50">
                                  <td colSpan={3} className="px-4 py-2 text-[10px] font-bold text-primary uppercase tracking-wider">{cat.label}</td>
                                </tr>
                                {cat.items.map((item) => (
                                  <tr key={item} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-2.5 text-xs text-gray-700">{item}</td>
                                    <td className="px-4 py-2.5 text-center">
                                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`${item} for Dept Lead`} />
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`${item} for Team Lead`} />
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                <button 
                  type="button"
                  onClick={() => {
                    if (modalStep === 1) {
                      setShowAddModal(false);
                    } else {
                      setModalStep(modalStep - 1);
                    }
                  }} 
                  className="btn-outline px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  {modalStep === 1 ? 'Cancel' : 'Back'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (modalStep < 3) {
                      setModalStep(modalStep + 1);
                    } else {
                      handleAddOrg();
                    }
                  }} 
                  className="btn-primary px-8 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  {modalStep === 1 ? (
                    <>Next: Departments <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                  ) : modalStep === 2 ? (
                    <>Next: Permissions <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                  ) : (
                    'Create Organization'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Name</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Admin Name</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Associated Email</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Facilitator</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Status</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Created Date</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {orgs.map((org, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <th scope="row" className="px-4 py-3 font-bold text-secondary">{org.name}</th>
                  <td className="px-4 py-3 text-gray-700">{org.admin}</td>
                  <td className="px-4 py-3 text-gray-600">{org.email}</td>
                  <td className="px-4 py-3 text-gray-700">{org.facilitator}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                      org.status === 'Active' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>{org.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{org.date}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" title="Login As" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Login as ${org.name}`}>
                      <UserIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" title="Edit" className="p-1.5 text-primary hover:bg-primary-light rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Edit ${org.name}`}>
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" title="Deactivate" className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Deactivate ${org.name}`}>
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FacilitatorsScreen = ({ initialShowAdd = false }: { initialShowAdd?: boolean }) => {
  const [showAddModal, setShowAddModal] = useState(initialShowAdd);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [facilitators, setFacilitators] = useState([
    { name: 'Toby Flenderson', email: 'toby@dm.com', phone: '+1 (555) 123-4567', orgs: ['Dunder Mifflin'], status: 'Active', date: '2024-01-15' },
    { name: 'Pepper Potts', email: 'pepper@stark.com', phone: '+1 (555) 987-6543', orgs: ['Stark Industries'], status: 'Active', date: '2024-02-01' },
    { name: 'Alfred Pennyworth', email: 'alfred@wayne.com', phone: '+1 (555) 444-3333', orgs: ['Wayne Corp'], status: 'Active', date: '2023-11-20' },
  ]);

  const handleAddFacilitator = () => {
    try {
      // Mock validation
      const success = Math.random() > 0.1;
      if (!success) throw new Error("Failed");

      setFacilitators([...facilitators, {
        name: 'New Facilitator',
        email: 'new@fac.com',
        phone: '+1 (555) 000-0000',
        orgs: ['Acme Corp'],
        status: 'Active',
        date: new Date().toISOString().split('T')[0]
      }]);
      setShowAddModal(false);
      setToast({ message: 'Facilitator added successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to add facilitator.', type: 'error' });
    }
  };

  const organizations = ['Dunder Mifflin', 'Stark Industries', 'Wayne Corp', 'Acme Corp', 'Globex'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <label htmlFor="facilitator-search" className="sr-only">Search facilitators</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <input id="facilitator-search" type="text" placeholder="Search facilitators..." className="input-field pl-9 py-1.5 focus-visible:ring-2 focus-visible:ring-primary outline-none" />
          </div>
          <button type="button" className="btn-outline flex items-center gap-2 py-1.5 focus-visible:ring-2 focus-visible:ring-primary outline-none"><Filter className="w-3.5 h-3.5" aria-hidden="true" /> Filter</button>
        </div>
        <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"><Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add Facilitator</button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-facilitator-title">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 id="add-facilitator-title" className="text-xl font-bold text-secondary">Add New Facilitator</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label="Close modal">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div>
                  <label htmlFor="fac-name" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Full Name</label>
                  <input id="fac-name" type="text" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="e.g. Toby Flenderson" />
                </div>
                <div>
                  <label htmlFor="fac-email" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Email Address</label>
                  <input id="fac-email" type="email" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="toby@dm.com" />
                </div>
                <div>
                  <label htmlFor="fac-phone" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Phone Number <span className="text-gray-500 font-normal">(Optional)</span></label>
                  <input id="fac-phone" type="tel" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Linked Organizations</label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-2 border border-gray-100 rounded-xl">
                    {organizations.map(org => (
                      <label key={org} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-xs text-gray-600">{org}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5 italic">One facilitator can be linked to multiple organizations.</p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none">Cancel</button>
                <button type="button" onClick={handleAddFacilitator} className="btn-primary px-8 focus-visible:ring-2 focus-visible:ring-primary outline-none">Add Facilitator</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Name</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Email</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Linked Organizations</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Status</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Created Date</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {facilitators.map((fac, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <th scope="row" className="px-4 py-3 font-normal">
                    <div className="font-bold text-secondary">{fac.name}</div>
                    <div className="text-[10px] text-gray-500">{fac.phone}</div>
                  </th>
                  <td className="px-4 py-3 text-gray-600">{fac.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(fac.orgs) ? fac.orgs.map(org => (
                        <span key={org} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{org}</span>
                      )) : <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{fac.orgs}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold uppercase">{fac.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{fac.date}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" title="Login As" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Login as ${fac.name}`}>
                      <UserIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" title="Edit" className="p-1.5 text-primary hover:bg-primary-light rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Edit ${fac.name}`}>
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" title="Deactivate" className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Deactivate ${fac.name}`}>
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SubHostsScreen = ({ initialShowAdd = false }: { initialShowAdd?: boolean }) => {
  const [showAddModal, setShowAddModal] = useState(initialShowAdd);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [subhosts, setSubhosts] = useState([
    { name: 'John Doe', email: 'john@host.com', phone: '+1 (555) 111-2222', status: 'Active', orgs: 12, maxOrgs: 20, date: '2024-01-10' },
    { name: 'Jane Smith', email: 'jane@host.com', phone: '+1 (555) 333-4444', status: 'Active', orgs: 5, maxOrgs: 10, date: '2024-02-15' },
  ]);

  const handleAddSubHost = () => {
    try {
      const success = Math.random() > 0.1;
      if (!success) throw new Error("Failed");

      setSubhosts([...subhosts, {
        name: 'New Sub Host',
        email: 'new@host.com',
        phone: '+1 (555) 000-0000',
        status: 'Active',
        orgs: 0,
        maxOrgs: 10,
        date: new Date().toISOString().split('T')[0]
      }]);
      setShowAddModal(false);
      setToast({ message: 'Sub Host added successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to add sub host.', type: 'error' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <label htmlFor="subhost-search" className="sr-only">Search sub hosts</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <input id="subhost-search" type="text" placeholder="Search sub hosts..." className="input-field pl-9 py-1.5 focus-visible:ring-2 focus-visible:ring-primary outline-none" />
          </div>
          <button type="button" className="btn-outline flex items-center gap-2 py-1.5 focus-visible:ring-2 focus-visible:ring-primary outline-none"><Filter className="w-3.5 h-3.5" aria-hidden="true" /> Filter</button>
        </div>
        <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"><Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add Sub Host</button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-subhost-title">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 id="add-subhost-title" className="text-xl font-bold text-secondary">Add New Sub Host</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label="Close modal">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div>
                  <label htmlFor="subhost-name" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Full Name</label>
                  <input id="subhost-name" type="text" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label htmlFor="subhost-email" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Email Address</label>
                  <input id="subhost-email" type="email" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="john@host.com" />
                </div>
                <div>
                  <label htmlFor="subhost-phone" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">Phone Number</label>
                  <input id="subhost-phone" type="tel" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label htmlFor="subhost-orgs" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">No. of Organizations Allowed</label>
                  <input id="subhost-orgs" type="number" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="e.g. 10" />
                  <p className="text-[10px] text-gray-500 mt-1.5 italic">Limit the number of organizations this sub host can add.</p>
                </div>
                <div>
                  <label htmlFor="subhost-users" className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5 tracking-wider">No. of Users Allowed</label>
                  <input id="subhost-users" type="number" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" placeholder="e.g. 50" />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none">Cancel</button>
                <button type="button" onClick={handleAddSubHost} className="btn-primary px-8 focus-visible:ring-2 focus-visible:ring-primary outline-none">Add Sub Host</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Name</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Email</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Status</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Orgs Created</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Users Added</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Created Date</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {subhosts.map((host, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <th scope="row" className="px-4 py-3 font-normal">
                    <div className="font-bold text-secondary">{host.name}</div>
                    <div className="text-[10px] text-gray-500">{host.phone}</div>
                  </th>
                  <td className="px-4 py-3 text-gray-600">{host.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold uppercase">{host.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{host.orgs} / {host.maxOrgs || '∞'}</div>
                    <div className="w-24 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden" role="progressbar" aria-valuenow={host.orgs} aria-valuemin={0} aria-valuemax={host.maxOrgs || 100} aria-label="Organizations created progress">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, (host.orgs / (host.maxOrgs || 100)) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{host.users || 0}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{host.date}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" title="Login As" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Login as ${host.name}`}>
                      <UserIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" title="Edit" className="p-1.5 text-primary hover:bg-primary-light rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Edit ${host.name}`}>
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" title="Deactivate" className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Deactivate ${host.name}`}>
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UsersScreen = ({ initialShowAdd = false }: { initialShowAdd?: boolean }) => {
  const [showAddUser, setShowAddUser] = useState(initialShowAdd);
  const [users, setUsers] = useState(MOCK_USERS);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isAddingNewDept, setIsAddingNewDept] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'Individual',
    organization: 'Actiknow',
    departmentName: '',
    title: ''
  });

  const departments = [...new Set(users.map(u => u.departmentName).filter(Boolean) as string[])];

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newUser.name || !newUser.email) throw new Error("Missing required fields");
      
      const user: User = {
        id: (users.length + 1).toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.userType as UserRole,
        department: newUser.organization,
        departmentName: newUser.departmentName,
        title: newUser.title,
        avatar: `https://picsum.photos/seed/${newUser.name}/100`
      };
      setUsers([user, ...users]);
      setShowAddUser(false);
      setNewUser({ name: '', email: '', phone: '', userType: 'Individual', organization: 'Actiknow', departmentName: '', title: '' });
      setIsAddingNewDept(false);
      setToast({ message: 'User added successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to add user. Please check all fields.', type: 'error' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <label htmlFor="user-search" className="sr-only">Search users</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <input id="user-search" type="text" placeholder="Search users..." className="input-field pl-9 py-1.5 focus-visible:ring-2 focus-visible:ring-primary outline-none" />
          </div>
          <button type="button" className="btn-outline flex items-center gap-2 py-1.5 focus-visible:ring-2 focus-visible:ring-primary outline-none"><Filter className="w-3.5 h-3.5" aria-hidden="true" /> Filter</button>
        </div>
        <button 
          type="button"
          onClick={() => {
            setShowAddUser(true);
            setIsAddingNewDept(false);
          }}
          className="btn-primary flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add User
        </button>
      </div>

      <AnimatePresence>
        {showAddUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 id="add-user-title" className="text-xl font-bold text-secondary">Add New User</h3>
                <button type="button" onClick={() => setShowAddUser(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label="Close modal">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <form id="add-user-form" onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="user-name" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Full Name</label>
                    <input 
                      id="user-name"
                      type="text" 
                      required
                      placeholder="Enter full name"
                      className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="user-email" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Email Address</label>
                    <input 
                      id="user-email"
                      type="email" 
                      required
                      placeholder="name@company.com"
                      className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="user-phone" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                      Phone Number <span className="text-gray-500 font-normal lowercase">(Optional)</span>
                    </label>
                    <input 
                      id="user-phone"
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="user-type" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">User Type</label>
                    <select 
                      id="user-type"
                      className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none"
                      value={newUser.userType}
                      onChange={(e) => setNewUser({...newUser, userType: e.target.value})}
                    >
                      <option value="Withii Host">Withii Host</option>
                      <option value="Individual">Individual</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="user-org" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Organization</label>
                    <select 
                      id="user-org"
                      className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none"
                      value={newUser.organization}
                      onChange={(e) => setNewUser({...newUser, organization: e.target.value})}
                    >
                      <option value="Actiknow">Actiknow</option>
                      <option value="BCG">BCG</option>
                      <option value="Salesforce">Salesforce</option>
                      <option value="Altassian">Altassian</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Squarespace">Squarespace</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="user-dept" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Department Name</label>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingNewDept(!isAddingNewDept)}
                        className="text-[10px] font-bold text-primary hover:underline focus:outline-none"
                      >
                        {isAddingNewDept ? 'Select Existing' : 'Add New'}
                      </button>
                    </div>
                    {isAddingNewDept ? (
                      <input 
                        id="user-dept"
                        type="text" 
                        placeholder="e.g. Sales, Engineering"
                        className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none"
                        value={newUser.departmentName}
                        onChange={(e) => setNewUser({...newUser, departmentName: e.target.value})}
                      />
                    ) : (
                      <select 
                        id="user-dept"
                        className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none"
                        value={newUser.departmentName}
                        onChange={(e) => setNewUser({...newUser, departmentName: e.target.value})}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="user-title" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Title</label>
                    <input 
                      id="user-title"
                      type="text" 
                      placeholder="e.g. Manager, Developer"
                      className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none"
                      value={newUser.title}
                      onChange={(e) => setNewUser({...newUser, title: e.target.value})}
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddUser(false)} className="btn-outline px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none">Cancel</button>
                <button form="add-user-form" type="submit" className="btn-primary px-8 focus-visible:ring-2 focus-visible:ring-primary outline-none">Create User</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Name</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Title</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Email</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Status</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">User Type</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Department</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Organization</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Created Date</th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {users.map((user, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <th scope="row" className="px-4 py-3 font-normal">
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} className="w-6 h-6 rounded-full" alt={`${user.name}'s avatar`} referrerPolicy="no-referrer" />
                      <span className="font-bold text-secondary">{user.name}</span>
                    </div>
                  </th>
                  <td className="px-4 py-3 text-gray-600">{user.title || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold uppercase">Active</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.role}</td>
                  <td className="px-4 py-3 text-gray-600">{user.departmentName || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{user.department}</td>
                  <td className="px-4 py-3 text-gray-600">2024-03-01</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" title="Login As" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Login as ${user.name}`}>
                      <UserIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" title="Edit" className="p-1.5 text-primary hover:bg-primary-light rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Edit ${user.name}`}>
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" title="Deactivate" className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`Deactivate ${user.name}`}>
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileScreen = () => (
  <div className="max-w-xl mx-auto space-y-6">
    <div className="card p-6">
      <h3 className="text-xl font-bold text-secondary mb-6">My Profile</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <img src={MOCK_USERS[0].avatar} className="w-16 h-16 rounded-full border-2 border-primary-light" alt="Your profile picture" referrerPolicy="no-referrer" />
          <div>
            <h4 className="text-lg font-bold">{MOCK_USERS[0].name}</h4>
            <p className="text-xs text-gray-600">{MOCK_USERS[0].role}</p>
            <button type="button" className="mt-1 text-primary text-xs font-bold hover:underline focus-visible:ring-2 focus-visible:ring-primary outline-none">Change Photo</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-name" className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
            <input id="profile-name" type="text" defaultValue={MOCK_USERS[0].name} className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
            <input id="profile-email" type="email" defaultValue={MOCK_USERS[0].email} className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" />
          </div>
        </div>
        <button type="button" className="btn-primary w-full py-2 text-base mt-4 focus-visible:ring-2 focus-visible:ring-primary outline-none">Save Changes</button>
      </div>
    </div>

    <div className="card p-6">
      <h3 className="text-lg font-bold text-secondary mb-4">Change Password</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="current-password" className="block text-xs font-medium text-gray-700 mb-1.5">Current Password</label>
          <input id="current-password" type="password" placeholder="••••••••" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="new-password" className="block text-xs font-medium text-gray-700 mb-1.5">New Password</label>
            <input id="new-password" type="password" placeholder="••••••••" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-xs font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input id="confirm-password" type="password" placeholder="••••••••" className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" />
          </div>
        </div>
        <button type="button" className="btn-outline w-full py-2 text-sm mt-2 focus-visible:ring-2 focus-visible:ring-primary outline-none">Update Password</button>
      </div>
    </div>
  </div>
);

const NetworkGraph = ({ data }: { data: { nodes: any[], links: any[] } }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 800;
    const height = 400;

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", (d: any) => Math.abs(d.value) * 2 + 1)
      .attr("stroke", (d: any) => d.value > 0 ? "#10b981" : d.value < 0 ? "#ef4444" : "#cbd5e1");

    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (d: any) => `${d.name}${d.score ? `, score: ${d.score}` : ''}`)
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("mouseenter", function() {
        d3.select(this).select(".score-text").transition().duration(200).style("opacity", 1);
      })
      .on("mouseleave", function() {
        d3.select(this).select(".score-text").transition().duration(200).style("opacity", 0);
      })
      .on("focus", function() {
        d3.select(this).select(".score-text").transition().duration(200).style("opacity", 1);
        d3.select(this).select("circle").attr("stroke", "#300a73").attr("stroke-width", 3);
      })
      .on("blur", function() {
        d3.select(this).select(".score-text").transition().duration(200).style("opacity", 0);
        d3.select(this).select("circle").attr("stroke", "#fff").attr("stroke-width", 2);
      });

    node.append("circle")
      .attr("r", (d: any) => d.isMain ? 20 : 16)
      .attr("fill", (d: any) => d.isMain ? "#300a73" : "#eab948")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add score to nodes
    node.filter((d: any) => d.score !== undefined && d.score !== null)
      .append("text")
      .attr("class", "score-text")
      .text((d: any) => d.score)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .style("opacity", 0)
      .style("pointer-events", "none");

    const label = svg.append("g")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .text((d: any) => d.name)
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("dx", (d: any) => d.isMain ? 24 : 20)
      .attr("dy", 4)
      .attr("fill", "#1e293b");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [data]);

  return (
    <div className="relative w-full h-[400px] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-inner">
      <svg ref={svgRef} className="w-full h-full" role="img" aria-label="Network graph showing relationships between team members. Nodes represent participants, and lines represent relationship scores." />
      <div className="absolute bottom-4 left-4 flex gap-4" aria-label="Legend">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#300a73]"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase">Main Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#eab948]"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase">Participants</span>
        </div>
      </div>
    </div>
  );
};

const AssessmentEntry = ({ onJoin }: { onJoin: (user: { name: string, email: string }) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      // Mock validation against "uploaded list"
      setStep(2);
      setError('');
    } else {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      onJoin({ name, email });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" role="main">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-8"
      >
        <div className="text-center">
          <Logo className="h-12 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-secondary">Join Assessment</h2>
          <p className="text-sm text-gray-400 mt-2">Please provide your details to continue</p>
        </div>

        <div className="space-y-6">
          {step === 1 ? (
            <div className="space-y-2">
              <label htmlFor="assessment-name" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Full Name</label>
              <input 
                id="assessment-name"
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name" 
                className="input-field py-3 focus-visible:ring-2 focus-visible:ring-primary outline-none" 
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="assessment-email" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Email Address</label>
              <input 
                id="assessment-email"
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="input-field py-3 focus-visible:ring-2 focus-visible:ring-primary outline-none" 
              />
            </div>
          )}

          {error && <p className="text-xs text-red-500 font-medium" role="alert">{error}</p>}

          <button 
            type="button"
            onClick={handleNext}
            className="btn-primary w-full py-4 text-sm font-bold shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            {step === 1 ? 'Next Step' : 'Start Assessment'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AssessmentPage = ({ user, onComplete }: { user: { name: string, email: string }, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [people] = useState([
    { id: '1', name: 'Michael Scott', role: 'Manager' },
    { id: '2', name: 'Pam Beesly', role: 'Team Lead' },
    { id: '3', name: 'Jim Halpert', role: 'Sales' },
    { id: '4', name: 'Dwight Schrute', role: 'Sales' },
  ]);
  const [ratings, setRatings] = useState<Record<string, { actual: number | null, target: number | null }>>({});

  const scoringLabels = [
    { value: -2, label: 'Division' },
    { value: -1, label: 'Subtraction' },
    { value: 0, label: 'Addition' },
    { value: 1, label: 'Multiplication' },
    { value: 2, label: 'Compounding' },
  ];

  const updateRating = (id: string, field: 'actual' | 'target', value: number) => {
    setRatings(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const isComplete = people.every(p => ratings[p.id]?.actual !== undefined && ratings[p.id]?.target !== undefined);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" role="main">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary">{user.name}</h1>
              <p className="text-xs text-gray-400">Participant Assessment</p>
            </div>
          </div>
          <Logo className="h-8" />
        </header>

        <div className="card p-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-secondary">Rate your relationships</h2>
            <p className="text-sm text-gray-500">Please rate the current and goal state for each team member.</p>
          </div>

          <div className="space-y-6">
            {people.map(p => (
              <div key={p.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-secondary">{p.name}</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{p.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current State</p>
                    <div className="flex justify-between gap-2" role="group" aria-label={`Rate current state with ${p.name}`}>
                      {scoringLabels.map(s => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => updateRating(p.id, 'actual', s.value)}
                          className={cn(
                            "flex-1 py-2 rounded-lg border-2 transition-all text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary outline-none",
                            ratings[p.id]?.actual === s.value ? "bg-primary border-primary text-white" : "bg-white border-gray-100 text-gray-400"
                          )}
                          aria-pressed={ratings[p.id]?.actual === s.value}
                          aria-label={`Rate current state with ${p.name} as ${s.value} (${s.label})`}
                        >
                          {s.value}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Goal State</p>
                    <div className="flex justify-between gap-2" role="group" aria-label={`Rate goal state with ${p.name}`}>
                      {scoringLabels.map(s => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => updateRating(p.id, 'target', s.value)}
                          className={cn(
                            "flex-1 py-2 rounded-lg border-2 transition-all text-xs font-bold focus-visible:ring-2 focus-visible:ring-accent outline-none",
                            ratings[p.id]?.target === s.value ? "bg-accent border-accent text-white" : "bg-white border-gray-100 text-gray-400"
                          )}
                          aria-pressed={ratings[p.id]?.target === s.value}
                          aria-label={`Rate goal state with ${p.name} as ${s.value} (${s.label})`}
                        >
                          {s.value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={onComplete}
            disabled={!isComplete}
            className="btn-primary w-full py-4 text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

const MapWizard = ({ 
  onComplete, 
  onCancel, 
  isGuest, 
  onSignup, 
  userRole = 'Withiii Host',
  initialData
}: { 
  onComplete: () => void, 
  onCancel?: () => void, 
  isGuest?: boolean, 
  onSignup?: () => void, 
  userRole?: string,
  initialData?: any
}) => {
  const canSelectMapType = !isGuest && userRole !== 'Individual User';
  const [step, setStep] = useState(initialData ? 3 : 1);
  const [mapType, setMapType] = useState<'personal' | 'within-team' | 'team-to-teams' | 'organization' | null>(
    initialData ? (initialData.type === 'Individual' ? 'personal' : initialData.type.toLowerCase().replace(' ', '-')) : (canSelectMapType ? null : 'personal')
  );
  const isAdvancedMap = mapType === 'within-team' || mapType === 'organization' || mapType === 'team-to-teams';
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [mapData, setMapData] = useState(initialData ? {
    name: initialData.name,
    description: initialData.description || '',
    category: initialData.category || 'Personal',
    mode: (initialData.mode?.toLowerCase() || 'online') as 'online' | 'offline',
    facilitators: initialData.facilitatorName ? [initialData.facilitatorName] : [],
    teamName: initialData.teamName || '',
    ratingTeams: initialData.ratingTeams || [],
    raters: [] as { name: string, email: string }[],
    inputFirst: 'Score',
    people: initialData.participants.map((pid: string) => {
      const u = MOCK_USERS.find(user => user.id === pid);
      return { 
        id: pid, 
        name: u?.name || 'Unknown', 
        email: u?.email || '', 
        actual: null, 
        target: null,
        lastActual: 1.2 // Mock last rating
      };
    }),
    inviteMethod: 'select-rep' as 'email' | 'link' | 'single' | 'bulk' | 'select-rep' | 'manual-emails' | 'bulk-users',
  } : {
    name: '',
    description: '',
    category: 'Personal',
    mode: 'online' as 'online' | 'offline',
    facilitators: [] as string[],
    teamName: '',
    ratingTeams: [] as string[],
    raters: [] as { name: string, email: string }[],
    inputFirst: 'Score',
    people: [] as { id: string, name: string, email: string, actual: number | null, target: number | null, lastActual?: number | null, group?: string }[],
    inviteMethod: 'select-rep' as 'email' | 'link' | 'single' | 'bulk' | 'select-rep' | 'manual-emails' | 'bulk-users',
  });
  const [newName, setNewName] = useState('');
  const [newRatingTeam, setNewRatingTeam] = useState('');
  const [newRater, setNewRater] = useState({ name: '', email: '' });
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '' });
  const [showManualParticipantForm, setShowManualParticipantForm] = useState(false);
  const [newFacilitator, setNewFacilitator] = useState('');
  const [selectedRatingTeamForRater, setSelectedRatingTeamForRater] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showOrgUsersModal, setShowOrgUsersModal] = useState(false);

  // Organizational Map Flow State
  const [orgFlow, setOrgFlow] = useState<'choice' | 'default-depts' | 'configure-groups'>('choice');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [configGroups, setConfigGroups] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupForManualAdd, setSelectedGroupForManualAdd] = useState('');
  const [orgParticipantMethod, setOrgParticipantMethod] = useState<'all-users' | 'bulk' | 'manual' | null>(null);
  const [manualAddMethod, setManualAddMethod] = useState<'select' | 'input' | null>(null);

  const addPerson = () => {
    if (newName.trim()) {
      setMapData({
        ...mapData,
        people: [...mapData.people, { id: Math.random().toString(36).substr(2, 9), name: newName, email: '', actual: null, target: null }]
      });
      setNewName('');
    }
  };

  const addFacilitator = () => {
    if (newFacilitator.trim()) {
      setMapData({
        ...mapData,
        facilitators: [...mapData.facilitators, newFacilitator]
      });
      setNewFacilitator('');
    }
  };

  const removeFacilitator = (index: number) => {
    setMapData({
      ...mapData,
      facilitators: mapData.facilitators.filter((_, i) => i !== index)
    });
  };

  const removePerson = (id: string) => {
    setMapData({ ...mapData, people: mapData.people.filter(p => p.id !== id) });
  };

  const updatePersonEmail = (id: string, email: string) => {
    setMapData({
      ...mapData,
      people: mapData.people.map(p => p.id === id ? { ...p, email } : p)
    });
  };

  const updateScore = (id: string, field: 'actual' | 'target', score: number) => {
    setMapData({
      ...mapData,
      people: mapData.people.map(p => p.id === id ? { ...p, [field]: score } : p)
    });
  };

  const scoringLabels = [
    { value: -2, label: 'Division', sub: '(Obstruct)' },
    { value: -1, label: 'Subtraction', sub: '(Resist)' },
    { value: 0, label: 'Addition', sub: '(Co-exist)' },
    { value: 1, label: 'Multiplication', sub: '(Collaborate)' },
    { value: 2, label: 'Compounding', sub: '(Integrate)' },
  ];

  const steps = mapType === 'team-to-teams' ? [
    { id: 1, title: 'Start', desc: 'Step 1' },
    { id: 2, title: 'Rating Teams', desc: 'Step 2' },
    { id: 3, title: 'Raters', desc: 'Step 3' },
    { id: 4, title: mapData.inputFirst === 'Goals' ? 'Goals' : 'Score', desc: 'Step 4' },
    { id: 5, title: mapData.inputFirst === 'Goals' ? 'Score' : 'Goals', desc: 'Step 5' },
    { id: 6, title: 'Insights', desc: 'Step 6' },
  ] : [
    { id: 1, title: 'Start', desc: 'Step 1' },
    { id: 2, title: mapType === 'organization' ? 'Teams & Groups' : (isAdvancedMap ? 'Participants' : 'Relationships'), desc: 'Step 2' },
    { id: 3, title: mapData.inputFirst === 'Goals' ? 'Goals' : 'Score', desc: 'Step 3' },
    { id: 4, title: mapData.inputFirst === 'Goals' ? 'Score' : 'Goals', desc: 'Step 4' },
    { id: 5, title: 'Insights', desc: 'Step 5' },
  ];

  if (!mapType) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-secondary">What kind of map would you like to create?</h2>
          <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label="Cancel map creation">
            <X className="w-6 h-6 text-gray-400" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <button 
            type="button"
            onClick={() => setMapType('personal')}
            className="card p-8 text-center hover:border-primary transition-all group w-full focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
              <UserIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-secondary">Personal Map</h3>
            <p className="text-xs text-gray-600">I want to map my own relationships with other people</p>
          </button>
          <button 
            type="button"
            onClick={() => setMapType('within-team')}
            className="card p-8 text-center hover:border-primary transition-all group w-full focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-secondary">Within-Team Map</h3>
            <p className="text-xs text-gray-600">I want to map the relationship between multiple people within my team</p>
          </button>
          <button 
            type="button"
            onClick={() => setMapType('team-to-teams')}
            className="card p-8 text-center hover:border-primary transition-all group w-full focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
              <Network className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-secondary">Team-to-Teams Map</h3>
            <p className="text-xs text-gray-600">I want to map the relationships between my team and other teams</p>
          </button>
          <button 
            type="button"
            onClick={() => setMapType('organization')}
            className="card p-8 text-center hover:border-primary transition-all group w-full focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-secondary">Organizational Map</h3>
            <p className="text-xs text-gray-600">I want to map the relationships between multiple teams or groups within my organization</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-secondary">
          {isGuest ? 'Guest Map Creation' : 'Create New Map'}
        </h2>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label="Cancel map creation">
          <X className="w-6 h-6 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex justify-between mb-8 relative overflow-x-auto no-scrollbar pb-2" aria-label="Map creation progress">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" aria-hidden="true"></div>
        {steps.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center min-w-[60px]">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-xs font-bold",
                step >= s.id ? "bg-primary border-primary text-white" : "bg-white border-gray-200 text-gray-500"
              )}
              aria-current={step === s.id ? "step" : undefined}
            >
              {step > s.id ? <CheckCircle2 className="w-5 h-5" aria-hidden="true" /> : s.id}
            </div>
            <p className={cn("mt-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-center", step >= s.id ? "text-gray-900" : "text-gray-500")}>{s.title}</p>
          </div>
        ))}
      </nav>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card p-6 min-h-[400px] flex flex-col"
      >
        {step === 1 && (
          <div className="space-y-6 max-w-xl mx-auto w-full">
            <h3 className="text-xl font-bold text-secondary">Step 1: Start</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="map-name" className="block text-xs font-medium text-gray-700 mb-1.5">Map Name</label>
                <input 
                  id="map-name"
                  type="text" 
                  value={mapData.name}
                  onChange={e => setMapData({...mapData, name: e.target.value})}
                  placeholder="e.g., My Core Network" 
                  className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                />
              </div>
              {mapType === 'within-team' && (
                <div>
                  <label htmlFor="team-name" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Team Name
                  </label>
                  <input 
                    id="team-name"
                    type="text" 
                    value={mapData.teamName}
                    onChange={e => setMapData({...mapData, teamName: e.target.value})}
                    placeholder="e.g., Sales Team, Engineering" 
                    className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                  />
                </div>
              )}
              {isAdvancedMap && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="map-desc" className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea 
                      id="map-desc"
                      value={mapData.description}
                      onChange={e => setMapData({...mapData, description: e.target.value})}
                      placeholder="Describe the purpose of this map..." 
                      className="input-field min-h-[80px] py-2 focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Input First</label>
                    <div className="flex gap-3" role="group" aria-label="Select what to input first">
                      {(['Score', 'Goals'] as const).map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setMapData({...mapData, inputFirst: opt})}
                          className={cn(
                            "flex-1 py-2 rounded-lg border-2 transition-all text-xs focus-visible:ring-2 focus-visible:ring-primary outline-none",
                            mapData.inputFirst === opt ? "border-primary bg-primary-light text-primary font-bold" : "border-gray-100 text-gray-600"
                          )}
                          aria-pressed={mapData.inputFirst === opt}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {isAdvancedMap ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Mode</label>
                    <div className="flex gap-3" role="group" aria-label="Select map mode">
                      {(['online', 'offline'] as const).map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            const newMode = m;
                            setMapData({
                              ...mapData, 
                              mode: newMode,
                              inviteMethod: mapType === 'team-to-teams' ? 'select-rep' : 'email'
                            });
                          }}
                          className={cn(
                            "flex-1 py-2 rounded-lg border-2 transition-all text-xs capitalize focus-visible:ring-2 focus-visible:ring-primary outline-none",
                            mapData.mode === m ? "border-primary bg-primary-light text-primary font-bold" : "border-gray-100 text-gray-600"
                          )}
                          aria-pressed={mapData.mode === m}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  {mapData.mode === 'offline' && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <label htmlFor="facilitator-input" className="block text-xs font-bold text-secondary uppercase tracking-wider">Facilitators</label>
                      <div className="flex gap-2">
                        <input 
                          id="facilitator-input"
                          type="text" 
                          value={newFacilitator}
                          onChange={e => setNewFacilitator(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && addFacilitator()}
                          placeholder="Facilitator Name" 
                          className="input-field flex-1 focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                        />
                        <button type="button" onClick={addFacilitator} className="btn-primary px-4 focus-visible:ring-2 focus-visible:ring-primary outline-none">Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mapData.facilitators.map((f, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-secondary">
                            {f}
                            <button type="button" onClick={() => removeFacilitator(i)} className="text-gray-500 hover:text-red-500 focus-visible:ring-2 focus-visible:ring-red-500 outline-none rounded" aria-label={`Remove facilitator ${f}`}>
                              <X className="w-3 h-3" aria-hidden="true" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                  <div className="flex gap-3" role="group" aria-label="Select map category">
                    {['Personal', 'Work', 'Other'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setMapData({...mapData, category: cat})}
                        className={cn(
                          "flex-1 py-2 rounded-lg border-2 transition-all text-xs focus-visible:ring-2 focus-visible:ring-primary outline-none",
                          mapData.category === cat ? "border-primary bg-primary-light text-primary font-bold" : "border-gray-100 text-gray-600"
                        )}
                        aria-pressed={mapData.category === cat}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!isGuest && !isAdvancedMap && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Input First</label>
                  <div className="flex gap-3" role="radiogroup" aria-label="Select what to input first">
                    {['Score', 'Goals'].map(type => (
                      <label key={type} className="flex-1 flex items-center gap-2 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary">
                        <input 
                          type="radio" 
                          name="inputFirst"
                          checked={mapData.inputFirst === type}
                          onChange={() => setMapData({...mapData, inputFirst: type})}
                          className="w-3.5 h-3.5 text-primary focus:ring-primary outline-none" 
                        />
                        <span className="text-xs font-medium text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <h3 className="text-xl font-bold text-secondary">
              Step 2: {mapType === 'team-to-teams' ? 'Rating Teams' : (mapType === 'organization' ? 'Teams & Groups' : (isAdvancedMap ? 'Participants' : 'Relationships'))}
            </h3>
            
            {mapType === 'organization' ? (
              <div className="space-y-6">
                {orgFlow === 'choice' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                    <button 
                      type="button" 
                      onClick={() => setOrgFlow('default-depts')}
                      className="card p-8 border-2 hover:border-primary transition-all group flex flex-col items-center text-center focus-visible:ring-2 focus-visible:ring-primary outline-none"
                    >
                      <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Building2 className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-secondary mb-2">Default Departments</h4>
                      <p className="text-[10px] text-gray-500">Create maps based on your existing organizational hierarchy</p>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setOrgFlow('configure-groups')}
                      className="card p-8 border-2 hover:border-primary transition-all group flex flex-col items-center text-center focus-visible:ring-2 focus-visible:ring-primary outline-none"
                    >
                      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Network className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-secondary mb-2">Configure Groups</h4>
                      <p className="text-[10px] text-gray-500">Define custom participation groups specifically for this map</p>
                    </button>
                  </div>
                )}

                {orgFlow === 'default-depts' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                    <div className="flex items-center gap-2 mb-2">
                       <button type="button" onClick={() => setOrgFlow('choice')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 focus-visible:ring-2 focus-visible:ring-primary outline-none">
                         <ChevronLeft className="w-4 h-4" />
                       </button>
                       <p className="text-xs font-bold text-secondary text-left">Back to Choice</p>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-secondary uppercase tracking-wider text-left">Select Department Names</label>
                      <div className="flex gap-2">
                        <select 
                          className="input-field flex-1 text-xs py-2 h-auto focus-visible:ring-2 focus-visible:ring-primary outline-none"
                          onChange={(e) => {
                            if (e.target.value && !selectedDepts.includes(e.target.value)) {
                              setSelectedDepts([...selectedDepts, e.target.value]);
                            }
                          }}
                          value=""
                        >
                          <option value="">Select a Department</option>
                          {['Human Resources', 'Marketing', 'Engineering', 'Sales', 'Product', 'Customer Success', 'Finance'].map(d => (
                            <option key={d} value={d} disabled={selectedDepts.includes(d)}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDepts.map((d, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-light text-primary text-xs font-bold rounded-full">
                            {d}
                            <button type="button" onClick={() => setSelectedDepts(selectedDepts.filter((_, idx) => idx !== i))} className="hover:text-secondary focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedDepts.length > 0 && (
                      <div className="space-y-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4">
                        <label className="block text-xs font-bold text-secondary uppercase tracking-wider text-center">How would you like to assign participants?</label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: 'all-users', label: 'All Users in Depts', icon: Users, desc: 'Auto-import everyone' },
                            { id: 'bulk', label: 'Bulk Upload', icon: UploadCloud, desc: 'CSV or Excel' },
                            { id: 'manual', label: 'Select Manually', icon: UserPlus, desc: 'Pick individuals' }
                          ].map(method => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setOrgParticipantMethod(method.id as any)}
                              className={cn(
                                "flex flex-col items-center gap-3 p-6 border-2 rounded-2xl transition-all group focus-visible:ring-2 focus-visible:ring-primary outline-none h-full",
                                orgParticipantMethod === method.id ? "border-primary bg-primary-light text-primary" : "border-gray-50 text-gray-600 bg-gray-50/50 hover:bg-white"
                              )}
                            >
                              <method.icon className={cn("w-6 h-6", orgParticipantMethod === method.id ? "text-primary" : "text-gray-400 group-hover:text-primary")} />
                              <div className="text-center">
                                <p className="text-[11px] font-bold">{method.label}</p>
                                <p className="text-[9px] opacity-70">{method.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>

                        {orgParticipantMethod === 'manual' && (
                          <div className="mt-4 p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors cursor-pointer group bg-gray-50/50" onClick={() => setShowOrgUsersModal(true)}>
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm" aria-hidden="true">
                              <UserCheck className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-secondary">Select Individuals</p>
                              <p className="text-[10px] text-gray-500">Select participants from the {selectedDepts.length} departments</p>
                            </div>
                          </div>
                        )}
                        {orgParticipantMethod === 'bulk' && (
                           <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer group bg-gray-50/50">
                             <UploadCloud className="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors" />
                             <p className="text-xs text-gray-500 text-center">Bulk Upload Participants (CSV/Excel)</p>
                           </div>
                        )}
                        {orgParticipantMethod === 'all-users' && (
                           <div className="p-6 bg-primary-light/50 border border-primary/10 rounded-xl text-center space-y-3 animate-in zoom-in-95">
                              <p className="text-xs font-bold text-primary">Ready to add all users from selected departments.</p>
                              <button 
                                type="button"
                                onClick={() => {
                                  const newUsers = selectedDepts.flatMap(dept => 
                                    [1,2,3,4].map(i => ({
                                      id: `org-${dept}-${i}`,
                                      name: `${dept} User ${i}`,
                                      email: `${dept.toLowerCase().replace(' ', '.')}.${i}@org.com`,
                                      actual: null,
                                      target: null,
                                      group: dept
                                    }))
                                  );
                                  setMapData({
                                    ...mapData,
                                    people: [...mapData.people, ...newUsers.filter(nu => !mapData.people.some(p => p.email === nu.email))]
                                  });
                                }}
                                className="btn-primary py-2 px-6 text-[10px] shadow-sm hover:translate-y-[-1px] transition-transform"
                                aria-label={`Confirm adding participants from ${selectedDepts.length} departments`}
                              >
                                Add {selectedDepts.length * 4} Participants
                              </button>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {orgFlow === 'configure-groups' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center gap-2 mb-2 text-left">
                       <button type="button" onClick={() => setOrgFlow('choice')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 focus-visible:ring-2 focus-visible:ring-primary outline-none">
                         <ChevronLeft className="w-4 h-4" />
                       </button>
                       <p className="text-xs font-bold text-secondary">Back to Choice</p>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-secondary uppercase tracking-wider text-left">Configure Group Names</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newGroupName}
                          onChange={e => setNewGroupName(e.target.value)}
                          onKeyPress={e => {
                            if (e.key === 'Enter' && newGroupName.trim()) {
                              setConfigGroups([...configGroups, newGroupName.trim()]);
                              if (!selectedGroupForManualAdd) setSelectedGroupForManualAdd(newGroupName.trim());
                              setNewGroupName('');
                            }
                          }}
                          placeholder="e.g., Regional Stakeholders, Executive Board" 
                          className="input-field flex-1 focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            if (newGroupName.trim()) {
                              setConfigGroups([...configGroups, newGroupName.trim()]);
                              if (!selectedGroupForManualAdd) setSelectedGroupForManualAdd(newGroupName.trim());
                              setNewGroupName('');
                            }
                          }}
                          className="btn-primary px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                        >
                          Add Group
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {configGroups.map((g, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full">
                            {g}
                            <button type="button" onClick={() => setConfigGroups(configGroups.filter((_, idx) => idx !== i))} className="hover:text-amber-800 focus-visible:ring-2 focus-visible:ring-amber-600 outline-none rounded">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {configGroups.length > 0 && (
                      <div className="space-y-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4">
                        <label className="block text-xs font-bold text-secondary uppercase tracking-wider text-center">Assign Participants to Groups</label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'bulk', label: 'Bulk Upload Participants', icon: UploadCloud, desc: 'Excel/CSV matching groups' },
                            { id: 'manual', label: 'Add Participants Manually', icon: UserPlus, desc: 'Assign to specific groups' }
                          ].map(method => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setOrgParticipantMethod(method.id as any)}
                              className={cn(
                                "flex flex-col items-center gap-3 p-6 border-2 rounded-2xl transition-all group focus-visible:ring-2 focus-visible:ring-primary outline-none h-full",
                                orgParticipantMethod === method.id ? "border-primary bg-primary-light text-primary" : "border-gray-50 text-gray-600 bg-gray-50/50 hover:bg-white"
                              )}
                            >
                              <method.icon className={cn("w-6 h-6", orgParticipantMethod === method.id ? "text-primary" : "text-gray-400 group-hover:text-primary")} />
                              <div className="text-center">
                                <p className="text-[11px] font-bold">{method.label}</p>
                                <p className="text-[9px] opacity-70">{method.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>

                        {orgParticipantMethod === 'manual' && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-4">
                              <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Select Target Group</label>
                                <select 
                                  className="input-field text-xs h-auto py-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                                  value={selectedGroupForManualAdd}
                                  onChange={e => setSelectedGroupForManualAdd(e.target.value)}
                                >
                                  {configGroups.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <button 
                                  type="button" 
                                  onClick={() => setShowOrgUsersModal(true)}
                                  className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl bg-white hover:border-primary hover:text-primary transition-all text-xs font-bold"
                                >
                                  <Users className="w-4 h-4" />
                                  Select from Users
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => setManualAddMethod('input')}
                                  className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl bg-white hover:border-primary hover:text-primary transition-all text-xs font-bold"
                                >
                                  <UserPlus className="w-4 h-4" />
                                  Add Name & Email
                                </button>
                              </div>

                              {manualAddMethod === 'input' && (
                                <div className="space-y-3 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
                                  <div className="grid grid-cols-2 gap-2 text-left">
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</label>
                                      <input 
                                        type="text" 
                                        placeholder="Full Name" 
                                        value={newParticipant.name}
                                        onChange={e => setNewParticipant({...newParticipant, name: e.target.value})}
                                        className="input-field text-xs bg-white" 
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
                                      <input 
                                        type="email" 
                                        placeholder="Email" 
                                        value={newParticipant.email}
                                        onChange={e => setNewParticipant({...newParticipant, email: e.target.value})}
                                        className="input-field text-xs bg-white" 
                                      />
                                    </div>
                                  </div>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      if (newParticipant.name && newParticipant.email) {
                                        setMapData({
                                          ...mapData,
                                          people: [...mapData.people, { 
                                            id: Math.random().toString(36).substr(2, 9), 
                                            name: newParticipant.name, 
                                            email: newParticipant.email, 
                                            actual: null, 
                                            target: null,
                                            group: selectedGroupForManualAdd
                                          }]
                                        });
                                        setNewParticipant({ name: '', email: '' });
                                        setManualAddMethod(null);
                                      }
                                    }}
                                    className="btn-primary w-full py-2 text-xs"
                                  >
                                    Add to {selectedGroupForManualAdd}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {orgParticipantMethod === 'bulk' && (
                           <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer group bg-gray-50/50">
                             <UploadCloud className="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors" />
                             <p className="text-xs text-center text-gray-500">Bulk Upload Group Participants (CSV/Excel)</p>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {orgFlow !== 'choice' && (
                  <div className="space-y-4 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-6">
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider text-left">Invite Method</label>
                    <div className="flex gap-3" role="group" aria-label="Select invitation method">
                      {(['email', ...(mapData.mode === 'offline' ? ['link'] : [])] as const).map(method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setMapData({...mapData, inviteMethod: method})}
                          className={cn(
                            "flex-1 py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none",
                            mapData.inviteMethod === method ? "border-primary bg-primary-light text-primary font-bold shadow-sm" : "border-gray-50 text-gray-500 bg-gray-50/30 hover:border-gray-100"
                          )}
                        >
                          {method === 'email' ? <Mail className="w-6 h-6" /> : <LinkIcon className="w-6 h-6" />}
                          <span className="text-xs capitalize">{method}</span>
                        </button>
                      ))}
                    </div>

                    {mapData.inviteMethod === 'link' && (
                      <div className="p-6 bg-primary-light/50 border border-primary/10 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm" aria-hidden="true">
                            <QrCode className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-secondary">Shared Assessment Link</p>
                            <p className="text-[10px] text-gray-500">Anyone with this link or QR can contribute ratings to this organization map.</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setShowQR(true)} className="btn-primary py-2 px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none whitespace-nowrap">Get QR Code</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : mapType === 'team-to-teams' ? (
              <div className="space-y-8">
                {/* Section 1: Rating Team Names (Multiple) */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Rating Team Names</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newRatingTeam}
                      onChange={e => setNewRatingTeam(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter' && newRatingTeam.trim()) {
                          setMapData({ ...mapData, ratingTeams: [...(mapData.ratingTeams || []), newRatingTeam.trim()] });
                          setNewRatingTeam('');
                        }
                      }}
                      placeholder="Enter Rating Team Name" 
                      className="input-field flex-1 focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (newRatingTeam.trim()) {
                          setMapData({ ...mapData, ratingTeams: [...(mapData.ratingTeams || []), newRatingTeam.trim()] });
                          setNewRatingTeam('');
                        }
                      }} 
                      className="btn-primary px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  {mapData.ratingTeams && mapData.ratingTeams.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mapData.ratingTeams.map((team, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                          {team}
                          <button 
                            type="button" 
                            onClick={() => setMapData({ ...mapData, ratingTeams: mapData.ratingTeams?.filter((_, i) => i !== idx) })}
                            className="hover:text-secondary"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Teams being Rated */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Teams being Rated</label>
                    <a href="#" className="text-[10px] font-bold text-primary hover:underline">Download Template</a>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addPerson()}
                      placeholder="Enter Team Name Being Rated" 
                      className="input-field flex-1 focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                    />
                    <button type="button" onClick={addPerson} className="btn-primary px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none whitespace-nowrap">Add Team</button>
                  </div>
                  
                  <div className="w-full">
                    <button type="button" className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary hover:bg-primary-light transition-all group focus-visible:ring-2 focus-visible:ring-primary outline-none w-full" aria-label="Bulk Upload Teams">
                      <Upload className="w-4 h-4 text-gray-500 group-hover:text-primary" />
                      <span className="text-xs font-bold text-secondary">Bulk Upload Team Names</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : isAdvancedMap ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <a href="#" className="text-[10px] font-bold text-primary hover:underline self-end mb-1 mr-1">Download Template</a>
                    <button type="button" className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary hover:bg-primary-light transition-all group focus-visible:ring-2 focus-visible:ring-primary outline-none w-full" aria-label="Bulk Upload CSV or Excel file">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white" aria-hidden="true">
                        <Upload className="w-6 h-6 text-gray-500 group-hover:text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-secondary">Bulk Upload</p>
                        <p className="text-[10px] text-gray-500">CSV or Excel file</p>
                      </div>
                    </button>
                  </div>
                  <div className="flex flex-col pt-5">
                    <button 
                      type="button"
                      onClick={() => {
                        setShowOrgUsersModal(true);
                      }}
                      className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary hover:bg-primary-light transition-all group focus-visible:ring-2 focus-visible:ring-primary outline-none h-full"
                      aria-label="Select participants manually from organization users"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white" aria-hidden="true">
                        <UserPlus className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-secondary">Select Manually</p>
                        <p className="text-[10px] text-gray-500">From organization users</p>
                      </div>
                    </button>
                  </div>
                  <div className="flex flex-col pt-5">
                    <button 
                      type="button"
                      onClick={() => setShowManualParticipantForm(!showManualParticipantForm)}
                      className={cn(
                        "flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-2xl transition-all group focus-visible:ring-2 focus-visible:ring-primary outline-none h-full",
                        showManualParticipantForm ? "border-primary bg-primary-light" : "border-gray-200 hover:border-primary hover:bg-primary-light"
                      )}
                      aria-label="Toggle add participant manually via email"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                        showManualParticipantForm ? "bg-white" : "bg-gray-50 group-hover:bg-white"
                      )} aria-hidden="true">
                        <Mail className={cn("w-6 h-6", showManualParticipantForm ? "text-primary" : "text-gray-500 group-hover:text-primary")} />
                      </div>
                      <div className="text-center">
                        <p className={cn("text-sm font-bold", showManualParticipantForm ? "text-primary" : "text-secondary")}>Add via Email</p>
                        <p className="text-[10px] text-gray-500">Manual input</p>
                      </div>
                    </button>
                  </div>
                </div>

                {showManualParticipantForm && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Name</label>
                        <input 
                          type="text" 
                          placeholder="Participant Name" 
                          value={newParticipant.name}
                          onChange={e => setNewParticipant({...newParticipant, name: e.target.value})}
                          className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none bg-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
                        <input 
                          type="email" 
                          placeholder="email@example.com" 
                          value={newParticipant.email}
                          onChange={e => setNewParticipant({...newParticipant, email: e.target.value})}
                          className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none bg-white" 
                        />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (newParticipant.name && newParticipant.email) {
                          setMapData({
                            ...mapData,
                            people: [...mapData.people, { id: Math.random().toString(36).substr(2, 9), name: newParticipant.name, email: newParticipant.email, actual: null, target: null }]
                          });
                          setNewParticipant({ name: '', email: '' });
                          setShowManualParticipantForm(false);
                        }
                      }}
                      className="btn-primary w-full py-2.5 text-xs focus-visible:ring-2 focus-visible:ring-primary outline-none"
                    >
                      Add Participant
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider">Invite Method</label>
                  <div className="flex gap-3" role="group" aria-label="Select invitation method">
                    {(['email', ...(mapData.mode === 'offline' ? ['link'] : [])] as const).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setMapData({...mapData, inviteMethod: method})}
                        className={cn(
                          "flex-1 py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary outline-none",
                          mapData.inviteMethod === method ? "border-primary bg-primary-light text-primary font-bold" : "border-gray-100 text-gray-600"
                        )}
                        aria-pressed={mapData.inviteMethod === method}
                      >
                        <span className="text-xs font-bold capitalize">{method === 'email' ? 'Send via Email' : 'Generate Link/QR'}</span>
                      </button>
                    ))}
                  </div>
                  
                  {mapData.inviteMethod === 'link' && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm" aria-hidden="true">
                          <QrCode className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-secondary">Assessment Link Ready</p>
                          <p className="text-[10px] text-gray-500">Participants can join via this link or QR</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setShowQR(true)} className="btn-outline py-1.5 px-4 text-[10px] focus-visible:ring-2 focus-visible:ring-primary outline-none">View QR</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <label htmlFor="participant-name" className="sr-only">Full Name</label>
                  <input 
                    id="participant-name"
                    type="text" 
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addPerson()}
                    placeholder="Full Name" 
                    className="input-field flex-1 focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                  />
                  <button type="button" onClick={addPerson} className="btn-primary px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none">Add</button>
                </div>

                <div className="flex flex-col border-t border-gray-100 pt-4">
                  <a href="#" className="text-[10px] font-bold text-primary hover:underline self-end mb-1 mr-1">Download Template</a>
                  <button type="button" className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary hover:bg-primary-light transition-all group focus-visible:ring-2 focus-visible:ring-primary outline-none w-full" aria-label="Bulk Upload CSV or Excel file">
                    <Upload className="w-4 h-4 text-gray-500 group-hover:text-primary" />
                    <span className="text-xs font-bold text-secondary text-center">Bulk Upload People (CSV/Excel)</span>
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                {mapType === 'team-to-teams' ? 'Teams to be Rated' : (isAdvancedMap ? 'Selected Participants' : 'People to Rate')} ({mapData.people.length})
              </p>
              <div className="space-y-2">
                {mapData.people.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-primary border border-gray-100" aria-hidden="true">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-secondary block">
                          {p.name}
                          {p.group && <span className="text-[10px] text-primary bg-primary-light px-2 py-0.5 rounded-full ml-2 font-bold">{p.group}</span>}
                        </span>
                        {p.email && <span className="text-[10px] text-gray-500">{p.email}</span>}
                        {mapType === 'team-to-teams' && <span className="text-[10px] text-gray-400 font-medium ml-2">• Team Entity</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => removePerson(p.id)} className="text-gray-500 hover:text-red-500 focus-visible:ring-2 focus-visible:ring-red-500 outline-none rounded" aria-label={`Remove ${p.name}`}>
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
                {mapData.people.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl text-xs">
                    {mapType === 'team-to-teams' ? 'No teams added yet.' : 'No participants added yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && mapType === 'team-to-teams' && (
          <div className="space-y-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-secondary">Step 3: Raters</h3>
            
            <div className="space-y-8">
              {/* Section 1: Rater Invitation Method */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider text-center">Rater Invitation Options</label>
                <div className={cn(
                  "grid gap-3",
                  mapData.mode === 'offline' ? "grid-cols-4" : "grid-cols-3"
                )}>
                  {[
                    { id: 'select-rep', label: 'Select Representative(s)', icon: UserCheck },
                    { id: 'manual-emails', label: 'Add Representative Email(s)', icon: UserPlus },
                    { id: 'bulk-users', label: 'Bulk Upload Users', icon: UploadCloud },
                    ...(mapData.mode === 'offline' ? [{ id: 'link', label: 'Link / QR', icon: QrCode }] : [])
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setMapData({...mapData, inviteMethod: method.id as any})}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none h-full",
                        mapData.inviteMethod === method.id ? "border-primary bg-primary-light text-primary font-bold shadow-sm" : "border-gray-50 text-gray-600 bg-gray-50/50 hover:bg-white"
                      )}
                    >
                      <method.icon className={cn("w-5 h-5", mapData.inviteMethod === method.id ? "text-primary" : "text-gray-400")} />
                      <span className="text-[9px] font-bold text-center leading-tight">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: Rater Details */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider text-center">
                  {mapData.inviteMethod === 'link' ? 'Rater Link' : 'Representative Details'}
                </label>
                
                <div className="mt-4">
                  {mapData.inviteMethod === 'select-rep' && (
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors cursor-pointer group bg-gray-50/50" onClick={() => setShowOrgUsersModal(true)}>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm" aria-hidden="true">
                        <UserCheck className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-secondary">Select from Users</p>
                        <p className="text-[10px] text-gray-500">Pick representatives from your organization</p>
                      </div>
                    </div>
                  )}
                  {mapData.inviteMethod === 'manual-emails' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                       <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Select Target Rating Team</label>
                          <select 
                            className="input-field text-xs h-auto py-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                            value={selectedRatingTeamForRater}
                            onChange={e => setSelectedRatingTeamForRater(e.target.value)}
                          >
                            <option value="">Select a team...</option>
                            {mapData.ratingTeams?.map(team => (
                              <option key={team} value={team}>{team}</option>
                            ))}
                          </select>
                        </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Representative Name</label>
                          <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={newRater.name}
                            onChange={e => setNewRater({...newRater, name: e.target.value})}
                            className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Representative Email</label>
                          <input 
                            type="email" 
                            placeholder="email@example.com" 
                            value={newRater.email}
                            onChange={e => setNewRater({...newRater, email: e.target.value})}
                            className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (newRater.name && newRater.email && selectedRatingTeamForRater) {
                            setMapData({...mapData, raters: [...(mapData.raters || []), { ...newRater, team: selectedRatingTeamForRater }]});
                            setNewRater({ name: '', email: '' });
                          }
                        }}
                        disabled={!selectedRatingTeamForRater}
                        className="btn-primary w-full focus-visible:ring-2 focus-visible:ring-primary outline-none disabled:opacity-50"
                      >
                        Add Representative
                      </button>
                      {mapData.raters && mapData.raters.length > 0 && (
                        <div className="space-y-2">
                          {mapData.raters.map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                              <div>
                                <p className="text-xs font-bold text-secondary">{r.name} {r.team && <span className="text-[10px] text-primary ml-1">({r.team})</span>}</p>
                                <p className="text-[10px] text-gray-500">{r.email}</p>
                              </div>
                              <button type="button" onClick={() => setMapData({...mapData, raters: mapData.raters?.filter((_, idx) => idx !== i)})} className="text-gray-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {mapData.inviteMethod === 'bulk-users' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                       <div className="flex justify-between items-center">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase">Bulk Upload Raters</label>
                          <a href="#" className="text-[10px] font-bold text-primary hover:underline">Download Template</a>
                        </div>
                      <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer group bg-gray-50/50">
                        <UploadCloud className="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors" />
                        <p className="text-xs text-gray-500">Click to upload or drag & drop CSV/Excel</p>
                      </div>
                    </div>
                  )}
                  {mapData.inviteMethod === 'link' && (
                    <div className="p-6 bg-primary-light/50 border border-primary/10 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm" aria-hidden="true">
                          <QrCode className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-secondary">Shared Rater Link</p>
                          <p className="text-[10px] text-gray-500">Anyone with this link or QR can contribute ratings.</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setShowQR(true)} className="btn-primary py-2 px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none whitespace-nowrap">Get QR Code</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === (mapType === 'team-to-teams' ? 4 : 3) && (
          <div className="space-y-6 w-full">
            <h3 className="text-xl font-bold text-secondary">Step {mapType === 'team-to-teams' ? '4' : '3'}: {mapData.inputFirst === 'Goals' ? 'Goals' : 'Score'}</h3>
            <p className="text-xs text-gray-600">Rate the {mapData.inputFirst === 'Goals' ? 'goal' : 'current'} state of your relationship with each person.</p>
            
            <div className="p-4 bg-primary-light rounded-xl">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-3">Scoring Guide:</p>
              <div className="grid grid-cols-5 gap-2">
                {scoringLabels.map(s => (
                  <div key={s.value} className="text-center">
                    <div className="text-xs font-bold text-secondary">{s.value}</div>
                    <div className="text-[8px] font-bold text-primary uppercase">{s.label}</div>
                    <div className="text-[8px] text-gray-600 leading-tight">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th scope="col" className="pb-3 text-xs font-bold text-secondary">Relationship with</th>
                    {scoringLabels.map(s => (
                      <th key={s.value} scope="col" className="pb-3 text-center px-1">
                        <span className="sr-only">Score {s.value}: {s.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mapData.people.map(p => (
                    <tr key={p.id}>
                      <th scope="row" className="py-4 text-sm font-bold text-secondary text-left">{p.name}</th>
                      {scoringLabels.map(s => (
                        <td key={s.value} className="py-4 px-1 text-center">
                          <button 
                            type="button"
                            onClick={() => updateScore(p.id, mapData.inputFirst === 'Goals' ? 'target' : 'actual', s.value)}
                            className={cn(
                              "w-8 h-8 rounded-lg border-2 transition-all text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary outline-none",
                              (mapData.inputFirst === 'Goals' ? p.target : p.actual) === s.value 
                                ? (mapData.inputFirst === 'Goals' ? "bg-accent border-accent text-white shadow-md shadow-accent/20" : "bg-primary border-primary text-white shadow-md shadow-primary/20")
                                : "border-gray-100 hover:border-gray-200 text-gray-500"
                            )}
                            aria-label={`Rate relationship with ${p.name} as ${s.value} (${s.label})`}
                            aria-pressed={(mapData.inputFirst === 'Goals' ? p.target : p.actual) === s.value}
                          >
                            {s.value}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === (mapType === 'team-to-teams' ? 5 : 4) && (
          <div className="space-y-6 w-full">
            <h3 className="text-xl font-bold text-secondary">Step {mapType === 'team-to-teams' ? '5' : '4'}: {mapData.inputFirst === 'Goals' ? 'Score' : 'Goals'}</h3>
            <p className="text-xs text-gray-600">Rate the {mapData.inputFirst === 'Goals' ? 'current' : 'goal'} state you would like to reach with each person.</p>
            
            <div className="p-4 bg-primary-light rounded-xl">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-3">Scoring Guide:</p>
              <div className="grid grid-cols-5 gap-2">
                {scoringLabels.map(s => (
                  <div key={s.value} className="text-center">
                    <div className="text-xs font-bold text-secondary">{s.value}</div>
                    <div className="text-[8px] font-bold text-primary uppercase">{s.label}</div>
                    <div className="text-[8px] text-gray-600 leading-tight">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th scope="col" className="pb-3 text-xs font-bold text-secondary">Relationship with</th>
                    {scoringLabels.map(s => (
                      <th key={s.value} scope="col" className="pb-3 text-center px-1">
                        <span className="sr-only">Score {s.value}: {s.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mapData.people.map(p => (
                    <tr key={p.id}>
                      <th scope="row" className="py-4 text-sm font-bold text-secondary text-left">{p.name}</th>
                      {scoringLabels.map(s => (
                        <td key={s.value} className="py-4 px-1 text-center">
                          <button 
                            type="button"
                            onClick={() => updateScore(p.id, mapData.inputFirst === 'Goals' ? 'actual' : 'target', s.value)}
                            className={cn(
                              "w-8 h-8 rounded-lg border-2 transition-all text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary outline-none",
                              (mapData.inputFirst === 'Goals' ? p.actual : p.target) === s.value 
                                ? (mapData.inputFirst === 'Goals' ? "bg-primary border-primary text-white shadow-md shadow-primary/20" : "bg-accent border-accent text-white shadow-md shadow-accent/20")
                                : "border-gray-100 hover:border-gray-200 text-gray-500"
                            )}
                            aria-label={`Rate goal for ${p.name} as ${s.value} (${s.label})`}
                            aria-pressed={(mapData.inputFirst === 'Goals' ? p.actual : p.target) === s.value}
                          >
                            {s.value}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === (mapType === 'team-to-teams' ? 6 : 5) && (
          <div className="space-y-8 w-full">
            <h3 className="text-xl font-bold text-secondary">Step {mapType === 'team-to-teams' ? '6' : '5'}: Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-primary text-white p-4 text-center">
                <p className="text-[10px] text-white/80 mb-0.5 uppercase font-bold tracking-wider">Average Score</p>
                <h4 className="text-3xl font-bold">1.8</h4>
              </div>
              <div className="card p-4 flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => isGuest ? setShowSignupPrompt(true) : setShowInviteModal(true)}
                  className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  <Send className="w-4 h-4" aria-hidden="true" /> Send Invitations
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-secondary">Relationship Network</h4>
              <NetworkGraph data={{
                nodes: [
                  { id: 'main', name: 'You', isMain: true },
                  ...mapData.people.map(p => ({ id: p.id, name: p.name, score: p.actual }))
                ],
                links: mapData.people.map(p => ({
                  source: 'main',
                  target: p.id,
                  value: p.actual ?? 0
                }))
              }} />
            </div>

            {isGuest && showSignupPrompt && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-orange-600 shadow-sm" aria-hidden="true">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary">Sign up to send invitations</p>
                    <p className="text-[10px] text-gray-600">You need an account to invite participants and track their responses.</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={onSignup}
                  className="btn-primary py-2 px-4 text-xs whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  Sign Up Now
                </button>
              </motion.div>
            )}

            <div className="card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[400px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">Relationship with</th>
                      <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-center">Last Rating</th>
                      <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-center">Current</th>
                      <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-center">Goal</th>
                      <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase text-center">Gap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {mapData.people.map(p => {
                      const gap = (p.target ?? 0) - (p.actual ?? 0);
                      return (
                        <tr key={p.id}>
                          <th scope="row" className="px-4 py-3 font-bold text-secondary text-left">{p.name}</th>
                          <td className="px-4 py-3 text-center text-gray-500 italic">{p.lastActual ?? 'N/A'}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary">{p.actual ?? '-'}</td>
                          <td className="px-4 py-3 text-center font-bold text-accent">{p.target ?? '-'}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={cn(
                              "px-2 py-0.5 rounded font-bold",
                              gap > 0 ? "bg-green-50 text-green-600" : gap < 0 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"
                            )}>
                              {gap > 0 ? `+${gap}` : gap}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-secondary">Understanding Your Score</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { val: -2, desc: 'Feeling held back or obstructed, profound lack of trust.' },
                  { val: -1, desc: 'Feeling unheard, success comes in spite of the other.' },
                  { val: 0, desc: 'Low attention to impact or what the other is doing.' },
                  { val: 1, desc: 'Actively helping each other in appreciated ways.' },
                  { val: 2, desc: 'Caring as much about other\'s success as one\'s own.' },
                ].map(item => (
                  <div key={item.val} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-7 h-7 rounded bg-white shadow-sm flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">{item.val}</div>
                    <p className="text-[10px] text-gray-600 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 flex justify-between">
          <button 
            type="button"
            onClick={() => step === 1 ? setMapType(null) : setStep(s => s - 1)}
            className="btn-outline px-6 focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            Back
          </button>
          <button 
            type="button"
            disabled={step === 2 && mapData.people.length === 0}
            onClick={() => step === steps.length ? onComplete() : setStep(s => s + 1)}
            className="btn-primary px-6 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === steps.length ? 'Finish' : 'Next Step'} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      {/* Organization Users Modal */}
      <AnimatePresence>
        {showOrgUsersModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="org-users-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrgUsersModal(false)}
              className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 id="org-users-title" className="text-lg font-bold text-secondary">Select Organization Users</h3>
                <button type="button" onClick={() => setShowOrgUsersModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label="Close modal">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {MOCK_USERS.map((u) => {
                  const isSelected = mapData.people.some(p => p.email === u.email);
                  return (
                    <button 
                      key={u.id} 
                      type="button"
                      onClick={() => {
                        if (mapType === 'team-to-teams' && mapData.inviteMethod === 'select-rep') {
                          const isRaterSelected = mapData.raters?.some(r => r.email === u.email);
                          if (isRaterSelected) {
                            setMapData({ ...mapData, raters: mapData.raters?.filter(r => r.email !== u.email) || [] });
                          } else {
                            setMapData({
                              ...mapData,
                              raters: [...(mapData.raters || []), { name: u.name, email: u.email }]
                            });
                          }
                        } else {
                          if (isSelected) {
                            setMapData({ ...mapData, people: mapData.people.filter(p => p.email !== u.email) });
                          } else {
                            let groupInfo = undefined;
                            if (mapType === 'organization') {
                              if (orgFlow === 'default-depts') {
                                groupInfo = selectedDepts.join(', ');
                              } else if (orgFlow === 'configure-groups') {
                                groupInfo = selectedGroupForManualAdd;
                              }
                            }
                            setMapData({
                              ...mapData,
                              people: [...mapData.people, { id: u.id, name: u.name, email: u.email, actual: null, target: null, group: groupInfo }]
                            });
                          }
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none",
                        (mapType === 'team-to-teams' && mapData.inviteMethod === 'select-rep')
                          ? (mapData.raters?.some(r => r.email === u.email) ? "border-primary bg-primary-light" : "border-gray-50 hover:border-gray-200")
                          : (isSelected ? "border-primary bg-primary-light" : "border-gray-50 hover:border-gray-200")
                      )}
                      aria-pressed={mapType === 'team-to-teams' && mapData.inviteMethod === 'select-rep' ? mapData.raters?.some(r => r.email === u.email) : isSelected}
                    >
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} className="w-10 h-10 rounded-full" alt={`${u.name}'s avatar`} referrerPolicy="no-referrer" />
                        <div className="text-left">
                          <p className="text-sm font-bold text-secondary">{u.name}</p>
                          <p className="text-[10px] text-gray-500">{u.department}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        isSelected ? "bg-primary border-primary text-white" : "border-gray-200"
                      )} aria-hidden="true">
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button type="button" onClick={() => setShowOrgUsersModal(false)} className="btn-primary w-full py-3 focus-visible:ring-2 focus-visible:ring-primary outline-none">Done</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(false)}
              className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 id="qr-modal-title" className="text-lg font-bold text-secondary">Assessment QR</h3>
                <button type="button" onClick={() => setShowQR(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label="Close modal">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex items-center justify-center">
                <QrCode className="w-48 h-48 text-primary" aria-label="QR Code for assessment" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-secondary">Scan to Join</p>
                <p className="text-xs text-gray-500">Participants can scan this code to start their assessment directly.</p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  const url = window.location.href + '?map=join';
                  navigator.clipboard.writeText(url);
                  // toast?
                }}
                className="btn-outline w-full py-3 text-xs flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
              >
                <LinkIcon className="w-3.5 h-3.5" aria-hidden="true" /> Copy Link
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invitation Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="invite-modal-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 id="invite-modal-title" className="text-lg font-bold text-secondary">Send Invitations</h3>
                <button type="button" onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label="Close modal">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <p className="text-xs text-gray-500 mb-4">Enter email addresses for each participant to send them an invitation to rate the relationship.</p>
                {mapData.people.map((p) => (
                  <div key={p.id} className="space-y-1.5">
                    <label htmlFor={`invite-email-${p.id}`} className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">{p.name}</label>
                    <input
                      id={`invite-email-${p.id}`}
                      type="email"
                      value={p.email}
                      onChange={(e) => updatePersonEmail(p.id, e.target.value)}
                      placeholder="email@example.com"
                      className="input-field py-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                    />
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => setShowInviteModal(false)} className="btn-outline flex-1 py-2.5 focus-visible:ring-2 focus-visible:ring-primary outline-none">Cancel</button>
                <button 
                  type="button"
                  onClick={() => {
                    // Logic to send invitations
                    setShowInviteModal(false);
                  }}
                  className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  <Send className="w-4 h-4" aria-hidden="true" /> Send Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MapVisualization = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewMode, setViewMode] = useState<'current' | 'ideal'>('current');

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes = MOCK_USERS.map(u => {
      const relevantRel = MOCK_RELATIONSHIPS.filter(r => r.fromId === u.id || r.toId === u.id);
      const avgScore = relevantRel.length > 0 
        ? relevantRel.reduce((acc, r) => acc + (viewMode === 'current' ? r.current : r.goal), 0) / relevantRel.length 
        : null;
      return { ...u, score: avgScore?.toFixed(1) };
    });
    const links = MOCK_RELATIONSHIPS.map(r => ({
      source: r.fromId,
      target: r.toId,
      value: viewMode === 'current' ? r.current : r.goal
    }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => d3.interpolateRdYlGn(d.value / 7))
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => d.value * 1.2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }))
      .on("mouseenter", function() {
        d3.select(this).selectAll(".score-overlay").transition().duration(200).style("opacity", 1);
      })
      .on("mouseleave", function() {
        d3.select(this).selectAll(".score-overlay").transition().duration(200).style("opacity", 0);
      });

    node.append("circle")
      .attr("r", 20)
      .attr("fill", "white")
      .attr("stroke", "#8a5fbb")
      .attr("stroke-width", 1.5);

    node.append("clipPath")
      .attr("id", (d: any) => `clip-${d.id}`)
      .append("circle")
      .attr("r", 18);

    node.append("image")
      .attr("xlink:href", (d: any) => d.avatar)
      .attr("x", -18)
      .attr("y", -18)
      .attr("width", 36)
      .attr("height", 36)
      .attr("clip-path", (d: any) => `url(#clip-${d.id})`);

    node.append("text")
      .text((d: any) => d.name)
      .attr("y", 32)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("fill", "#374151");

    // Add score to nodes
    node.filter((d: any) => d.score !== undefined && d.score !== null)
      .append("rect")
      .attr("class", "score-overlay")
      .attr("x", -12)
      .attr("y", -12)
      .attr("width", 24)
      .attr("height", 14)
      .attr("rx", 4)
      .attr("fill", "rgba(48, 10, 115, 0.8)")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("opacity", 0)
      .style("pointer-events", "none");

    node.filter((d: any) => d.score !== undefined && d.score !== null)
      .append("text")
      .attr("class", "score-overlay")
      .text((d: any) => d.score)
      .attr("text-anchor", "middle")
      .attr("dy", -2)
      .attr("fill", "white")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .style("opacity", 0)
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [viewMode]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg" role="group" aria-label="View mode">
          <button 
            type="button"
            aria-pressed={viewMode === 'current'}
            onClick={() => setViewMode('current')}
            className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none", viewMode === 'current' ? "bg-white shadow-sm text-primary" : "text-gray-600")}
          >
            Current State
          </button>
          <button 
            type="button"
            aria-pressed={viewMode === 'ideal'}
            onClick={() => setViewMode('ideal')}
            className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none", viewMode === 'ideal' ? "bg-white shadow-sm text-primary" : "text-gray-600")}
          >
            Ideal State
          </button>
        </div>
        <div className="flex gap-3" aria-label="Legend">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
            <div className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true"></div> Low
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true"></div> High
          </div>
        </div>
      </div>
      
      <div className="card bg-gray-50/50 overflow-hidden relative p-0">
        <svg 
          ref={svgRef} 
          width="100%" 
          height="400" 
          className="cursor-move" 
          role="img" 
          aria-label={`Network graph showing ${viewMode} relationship states between team members.`}
        />
        <div className="absolute bottom-4 left-4 p-3 bg-white/80 backdrop-blur rounded-lg border border-gray-100 shadow-sm max-w-[200px]">
          <h4 className="font-bold text-xs mb-1.5 text-secondary">Map Insights</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-red-600 font-medium">
              <AlertCircle className="w-3 h-3" aria-hidden="true" /> Large gap: Dwight ↔ Pam
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-orange-600 font-medium">
              <AlertCircle className="w-3 h-3" aria-hidden="true" /> Low score: Dwight ↔ Jim
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RatingScreen = () => {
  const [rating, setRating] = useState(4);
  const [ideal, setIdeal] = useState(6);

  return (
    <div className="max-w-xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-secondary">Rate Relationship</h2>
        <p className="text-xs text-gray-600">How would you describe your relationship with Sarah Chen?</p>
      </div>

      <div className="flex items-center justify-center gap-8" aria-label={`Relationship between You and Sarah Chen. Current rating: ${rating}, Ideal rating: ${ideal}.`}>
        <div className="text-center">
          <img src={MOCK_USERS[0].avatar} className="w-16 h-16 rounded-full border-2 border-white shadow-md mx-auto mb-2" alt="Your avatar" referrerPolicy="no-referrer" />
          <p className="text-xs font-bold text-secondary">You</p>
        </div>
        <div className="flex flex-col items-center" aria-hidden="true">
          <div className="h-px w-20 bg-gray-200 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
        <div className="text-center">
          <img src={MOCK_USERS[1].avatar} className="w-16 h-16 rounded-full border-2 border-white shadow-md mx-auto mb-2" alt="Sarah Chen's avatar" referrerPolicy="no-referrer" />
          <p className="text-xs font-bold text-secondary">Sarah Chen</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label htmlFor="current-rating" className="font-bold text-sm text-secondary">Current Relationship</label>
            <span className="text-2xl font-bold text-primary" aria-live="polite">{rating}</span>
          </div>
          <input 
            id="current-rating"
            type="range" min="1" max="7" step="1" 
            value={rating} 
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary focus-visible:ring-2 focus-visible:ring-primary outline-none"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider" aria-hidden="true">
            <span>Distant</span>
            <span>Neutral</span>
            <span>Strong</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label htmlFor="ideal-rating" className="font-bold text-sm text-secondary">Ideal Relationship</label>
            <span className="text-2xl font-bold text-gray-500" aria-live="polite">{ideal}</span>
          </div>
          <input 
            id="ideal-rating"
            type="range" min="1" max="7" step="1" 
            value={ideal} 
            onChange={(e) => setIdeal(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-400 focus-visible:ring-2 focus-visible:ring-primary outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="rating-comments" className="text-xs font-bold text-secondary">Comments (Optional)</label>
          <textarea 
            id="rating-comments"
            placeholder="Add context about this relationship..." 
            className="input-field min-h-[80px] text-xs resize-none focus-visible:ring-2 focus-visible:ring-primary outline-none"
          ></textarea>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-[10px] text-gray-600 font-medium">
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={4} aria-valuemin={0} aria-valuemax={12} aria-label="Rating progress">
              <div className="w-1/3 h-full bg-primary"></div>
            </div>
            <span>4 of 12 completed</span>
          </div>
          <button type="button" className="btn-primary px-6 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none">Save & Next</button>
        </div>
      </div>
    </div>
  );
};

const AnalyticsScreen = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-4">
        <h3 className="font-bold text-sm mb-4 text-secondary">Gap Analysis (Current vs Ideal)</h3>
        <div className="h-48" role="img" aria-label="Bar chart showing gap analysis between current and ideal states for Trust, Communication, Alignment, and Collaboration.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Trust', current: -0.2, ideal: 1.5 },
              { name: 'Comm.', current: -0.8, ideal: 1.0 },
              { name: 'Align.', current: 1.1, ideal: 1.2 },
              { name: 'Collab.', current: 0.5, ideal: 1.8 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#4b5563' }} />
              <YAxis axisLine={false} tickLine={false} fontSize={10} domain={[-2, 2]} ticks={[-2, -1, 0, 1, 2]} tick={{ fill: '#4b5563' }} />
              <Tooltip />
              <Bar dataKey="current" fill="#8a5fbb" radius={[2, 2, 0, 0]} />
              <Bar dataKey="ideal" fill="#94A3B8" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="card p-4">
        <h3 className="font-bold text-sm mb-4 text-secondary">Relationship Evolution</h3>
        <div className="h-48" role="img" aria-label="Line chart showing relationship evolution over time.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ANALYTICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#4b5563' }} />
              <YAxis axisLine={false} tickLine={false} fontSize={10} domain={[-2, 2]} ticks={[-2, -1, 0, 1, 2]} tick={{ fill: '#4b5563' }} />
              <Tooltip />
              <Line type="monotone" dataKey="current" stroke="#8a5fbb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: 'Highest Growth', user: 'Sarah Chen', change: '+1.2', color: 'text-green-600' },
        { title: 'Largest Gap', user: 'Dwight Schrute', change: '-2.4', color: 'text-red-600' },
        { title: 'Most Improved', user: 'Jim Halpert', change: '+0.8', color: 'text-primary' },
      ].map((insight, i) => (
        <div key={i} className="card p-3">
          <p className="text-[10px] text-gray-600 mb-0.5 uppercase font-bold tracking-wider">{insight.title}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-secondary">{insight.user}</p>
            <span className={cn("text-xs font-bold", insight.color)}>{insight.change}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UserManagement = () => (
  <div className="card overflow-hidden p-0">
    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
      <div className="flex items-center gap-4">
        <div className="relative">
          <label htmlFor="user-filter" className="sr-only">Filter users</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
          <input id="user-filter" type="text" placeholder="Filter users..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 focus-visible:ring-2 focus-visible:ring-primary outline-none" />
        </div>
        <button type="button" className="btn-secondary flex items-center gap-2 text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none">
          <Filter className="w-4 h-4" aria-hidden="true" /> Role
        </button>
      </div>
      <button type="button" className="btn-primary flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none">
        <Plus className="w-4 h-4" aria-hidden="true" /> Add User
      </button>
    </div>
    <table className="w-full text-left">
      <thead>
        <tr className="text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-100">
          <th scope="col" className="px-6 py-4">User</th>
          <th scope="col" className="px-6 py-4">Title</th>
          <th scope="col" className="px-6 py-4">Role</th>
          <th scope="col" className="px-6 py-4">Department</th>
          <th scope="col" className="px-6 py-4">Organization</th>
          <th scope="col" className="px-6 py-4">Status</th>
          <th scope="col" className="px-6 py-4"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {MOCK_USERS.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
            <th scope="row" className="px-6 py-4 font-normal">
              <div className="flex items-center gap-3">
                <img src={user.avatar} className="w-10 h-10 rounded-full" alt={`${user.name}'s avatar`} referrerPolicy="no-referrer" />
                <div>
                  <p className="font-semibold text-sm text-secondary">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </th>
            <td className="px-6 py-4 text-sm text-gray-600">{user.title || '-'}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">{user.role}</span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{user.departmentName || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{user.department}</td>
            <td className="px-6 py-4">
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" aria-hidden="true"></div> Active
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <button type="button" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label={`More actions for ${user.name}`}>
                <MoreVertical className="w-4 h-4" aria-hidden="true" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PermissionConfig = () => {
  const [groups, setGroups] = useState<PermissionGroup[]>([
    {
      id: 'g1',
      name: 'Map Creation',
      permissions: [
        { id: 'p1', label: 'Create Individual Maps', enabled: true },
        { id: 'p2', label: 'Create Team Maps', enabled: true },
        { id: 'p3', label: 'Create Organization Maps', enabled: false },
      ]
    },
    {
      id: 'g2',
      name: 'Map Access',
      permissions: [
        { id: 'p4', label: 'View Own Maps', enabled: true },
        { id: 'p5', label: 'View Department Maps', enabled: true },
        { id: 'p6', label: 'View All Organization Maps', enabled: false },
      ]
    },
    {
      id: 'g3',
      name: 'Analytics',
      permissions: [
        { id: 'p7', label: 'View Personal Insights', enabled: true },
        { id: 'p8', label: 'View Team Insights', enabled: true },
        { id: 'p9', label: 'Export Analytics Reports', enabled: false },
      ]
    }
  ]);

  const togglePermission = (groupId: string, permId: string) => {
    setGroups(groups.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        permissions: g.permissions.map(p => p.id === permId ? { ...p, enabled: !p.enabled } : p)
      };
    }));
  };

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-secondary">Role Permissions</h2>
          <p className="text-[10px] text-gray-600">Configure what Team Leads can do in the system.</p>
        </div>
        <button type="button" className="btn-primary px-3 py-1.5 text-[10px] focus-visible:ring-2 focus-visible:ring-primary outline-none">Save Changes</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="card p-0 overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-[9px] uppercase tracking-wider text-gray-600">{group.name}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {group.permissions.map((perm) => (
                <div key={perm.id} className="px-3 py-2 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <span className="text-[10px] font-medium text-gray-700">{perm.label}</span>
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={perm.enabled}
                    aria-label={`Toggle ${perm.label}`}
                    onClick={() => togglePermission(group.id, perm.id)}
                    className={cn("w-8 h-4 rounded-full transition-colors relative focus-visible:ring-2 focus-visible:ring-primary outline-none", perm.enabled ? "bg-primary" : "bg-gray-200")}
                  >
                    <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", perm.enabled ? "right-0.5" : "left-0.5")}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DepartmentsScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [selectedDeptUsers, setSelectedDeptUsers] = useState<{name: string, email: string}[] | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [departments, setDepartments] = useState(() => {
    const existingDepts = [...new Set(MOCK_USERS.map(u => u.departmentName).filter(Boolean) as string[])];
    return existingDepts.map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      orgName: MOCK_USERS.find(u => u.departmentName === name)?.department || 'Actiknow',
      isActive: true
    }));
  });

  const getDeptUserCount = (deptName: string) => {
    return MOCK_USERS.filter(u => u.departmentName === deptName).length;
  };

  const getDeptUsers = (deptName: string) => {
    return MOCK_USERS.filter(u => u.departmentName === deptName).map(u => ({ name: u.name, email: u.email }));
  };

  const toggleDeptStatus = (id: string) => {
    setDepartments(departments.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeptName.trim()) {
      setDepartments([...departments, {
        id: Date.now().toString(),
        name: newDeptName.trim(),
        orgName: 'Actiknow',
        isActive: true
      }]);
      setNewDeptName('');
      setShowAddModal(false);
      setToast({ message: 'Department added successfully!', type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-secondary">Departments Management</h2>
          <p className="text-sm text-gray-500">Manage your organization's structured departments and view team members.</p>
        </div>
        <button 
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Active Users</th>
                <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {departments.map((dept) => {
                const userCount = getDeptUserCount(dept.name);
                return (
                  <motion.tr 
                    key={dept.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => setSelectedDeptUsers(getDeptUsers(dept.name))}
                          className="w-8 h-8 bg-primary-light text-primary rounded-lg flex items-center justify-center shrink-0 hover:bg-primary hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                          aria-label={`View users in ${dept.name}`}
                        >
                          <Building2 className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-secondary">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          type="button"
                          onClick={() => setSelectedDeptUsers(getDeptUsers(dept.name))}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-primary rounded-full hover:bg-primary-light transition-colors font-bold text-xs focus-visible:ring-2 focus-visible:ring-primary outline-none"
                          aria-label={`Show ${userCount} users in ${dept.name}`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          {userCount} {userCount === 1 ? 'User' : 'Users'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleDeptStatus(dept.id)}
                        className={cn(
                          "relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          dept.isActive ? "bg-primary" : "bg-gray-200"
                        )}
                        role="switch"
                        aria-checked={dept.isActive}
                        aria-label={`Toggle ${dept.name} status`}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out",
                            dept.isActive ? "translate-x-5.5" : "translate-x-1"
                          )}
                        />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {departments.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm text-gray-400 italic">No departments found.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-dept-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
              <h3 id="add-dept-title" className="text-xl font-bold text-secondary mb-6">Add New Department</h3>
              <form onSubmit={handleAddDept} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="dept-name-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department Name</label>
                  <input 
                    id="dept-name-input"
                    autoFocus
                    type="text"
                    required
                    className="input-field focus-visible:ring-2 focus-visible:ring-primary outline-none"
                    placeholder="e.g. Creative Services"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline flex-1 focus-visible:ring-2 focus-visible:ring-primary outline-none">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 focus-visible:ring-2 focus-visible:ring-primary outline-none">Create Department</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDeptUsers && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="dept-users-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDeptUsers(null)}
              className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 id="dept-users-title" className="text-lg font-bold text-secondary">Department Users</h3>
                <button type="button" onClick={() => setSelectedDeptUsers(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none" aria-label="Close modal">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar pb-8">
                {selectedDeptUsers.length > 0 ? (
                  selectedDeptUsers.map((user, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                      <div className="w-10 h-10 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-xs shrink-0" aria-hidden="true">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-secondary truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400 italic">No users assigned to this department yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

const ParticipationTracker = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold text-secondary">Sales Team Q1 Tracker</h2>
      <button type="button" className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-[10px] focus-visible:ring-2 focus-visible:ring-primary outline-none">
        <Mail className="w-3 h-3" aria-hidden="true" /> Remind All Pending
      </button>
    </div>

    <div className="grid grid-cols-3 gap-3">
      <div className="card flex items-center gap-2 p-2.5">
        <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center font-bold text-sm">8</div>
        <div><p className="text-[9px] text-gray-600 uppercase font-bold tracking-wider">Completed</p></div>
      </div>
      <div className="card flex items-center gap-2 p-2.5">
        <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center font-bold text-sm">3</div>
        <div><p className="text-[9px] text-gray-600 uppercase font-bold tracking-wider">Pending</p></div>
      </div>
      <div className="card flex items-center gap-2 p-2.5">
        <div className="w-8 h-8 bg-primary-light text-primary rounded-lg flex items-center justify-center font-bold text-sm">72%</div>
        <div><p className="text-[9px] text-gray-600 uppercase font-bold tracking-wider">Progress</p></div>
      </div>
    </div>

    <div className="card overflow-hidden p-0">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50">
            <th scope="col" className="px-3 py-2">Participant</th>
            <th scope="col" className="px-3 py-2">Status</th>
            <th scope="col" className="px-3 py-2">Last Activity</th>
            <th scope="col" className="px-3 py-2">Progress</th>
            <th scope="col" className="px-3 py-2"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-[10px]">
          {[
            { name: 'Jim Halpert', status: 'Completed', date: 'Mar 12, 2024', progress: 100 },
            { name: 'Dwight Schrute', status: 'Pending', date: 'Mar 10, 2024', progress: 45 },
            { name: 'Pam Beesly', status: 'Completed', date: 'Mar 11, 2024', progress: 100 },
          ].map((p, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <th scope="row" className="px-3 py-2 font-bold text-secondary text-left">{p.name}</th>
              <td className="px-3 py-2">
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                  p.status === 'Completed' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                )}>{p.status}</span>
              </td>
              <td className="px-3 py-2 text-gray-500">{p.date}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.name}'s progress`}>
                    <div className="h-full bg-primary" style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <span className="text-[9px] font-bold">{p.progress}%</span>
                </div>
              </td>
              <td className="px-3 py-2 text-right">
                {p.status === 'Pending' && (
                  <button type="button" className="text-primary text-[9px] font-bold hover:underline uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-primary outline-none rounded" aria-label={`Send reminder to ${p.name}`}>Remind</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [assessmentUser, setAssessmentUser] = useState<{ name: string, email: string } | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [reRatingMap, setReRatingMap] = useState<any>(null);

  useEffect(() => {
    // Check if joining via link
    const params = new URLSearchParams(window.location.search);
    if (params.get('map') === 'join') {
      setIsJoining(true);
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isJoining) {
    if (assessmentUser) {
      return <AssessmentPage user={assessmentUser} onComplete={() => {
        setAssessmentUser(null);
        setIsJoining(false);
        window.history.replaceState({}, '', window.location.pathname);
      }} />;
    }
    return <AssessmentEntry onJoin={setAssessmentUser} />;
  }

  if (!isLoggedIn && !isGuest) {
    return (
      <LoginScreen 
        onLogin={() => {
          setIsLoggedIn(true);
          setIsGuest(false);
        }} 
        onGuest={() => {
          setIsGuest(true);
          setCurrentScreen('create-map');
        }}
      />
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard onAction={setCurrentScreen} />;
      case 'maps': return <MapsScreen onAddMap={() => setCurrentScreen('create-map')} onReRate={(map) => { setReRatingMap(map); setCurrentScreen('create-map'); }} />;
      case 'organizations': return <OrganizationsScreen />;
      case 'organizations-add': return <OrganizationsScreen initialShowAdd />;
      case 'facilitators': return <FacilitatorsScreen />;
      case 'facilitators-add': return <FacilitatorsScreen initialShowAdd />;
      case 'departments': return <DepartmentsScreen />;
      case 'subhosts': return <SubHostsScreen />;
      case 'subhosts-add': return <SubHostsScreen initialShowAdd />;
      case 'users': return <UsersScreen />;
      case 'users-add': return <UsersScreen initialShowAdd />;
      case 'profile': return <ProfileScreen />;
      case 'create-map': return (
        <MapWizard 
          onComplete={() => {
            setReRatingMap(null);
            isGuest ? setIsGuest(false) : setCurrentScreen('maps');
          }} 
          onCancel={() => {
            setReRatingMap(null);
            isGuest ? setIsGuest(false) : setCurrentScreen('maps');
          }}
          isGuest={isGuest} 
          userRole={isGuest ? 'Guest' : MOCK_USERS[0].role}
          initialData={reRatingMap}
          onSignup={() => {
            setReRatingMap(null);
            setIsGuest(false);
            setIsLoggedIn(false);
          }}
        />
      );
      case 'map-viz': return <MapVisualization />;
      case 'rating': return <RatingScreen />;
      case 'analytics': return <AnalyticsScreen />;
      case 'settings': return <PermissionConfig />;
      case 'tracker': return <ParticipationTracker />;
      default: return <Dashboard onAction={setCurrentScreen} />;
    }
  };

  const getTitle = () => {
    if (isGuest) return 'Guest Map Creation';
    switch (currentScreen) {
      case 'dashboard': return 'Global Dashboard';
      case 'maps': return 'Maps';
      case 'organizations': return 'Organizations';
      case 'departments': return 'Departments';
      case 'facilitators': return 'Facilitators';
      case 'subhosts': return 'Sub Hosts';
      case 'users': return 'Users';
      case 'create-map': return 'Create Map';
      default: return 'Withiii';
    }
  };

  return (
    <div className="min-h-screen bg-white flex w-full">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none">
        Skip to main content
      </a>
      {!isGuest && (
        <Sidebar 
          activeScreen={currentScreen} 
          setScreen={setCurrentScreen} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      )}
      
      <div className={cn(
        "transition-all duration-300 ease-in-out min-h-screen flex flex-col w-full min-w-0",
        !isGuest && (isSidebarOpen ? "lg:pl-64" : "lg:pl-20")
      )}>
        <Header 
          title={getTitle()} 
          onLogout={() => {
            setIsLoggedIn(false);
            setIsGuest(false);
          }} 
          isGuest={isGuest}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1800px] mx-auto outline-none" tabIndex={-1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
