import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, PieChart, Home, Settings, PlusCircle, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CurrencySelector from './CurrencySelector';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: authState, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 shadow-sm">
        <div className="p-4 flex items-center space-x-3 border-b border-gray-100">
          <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center animate-fade-in">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-medium text-gray-900">Spend Wise</h1>
        </div>

        {authState.user && (
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500">Welcome back,</p>
            <p className="text-sm font-medium text-gray-900">{authState.user.name}</p>
            <p className="text-xs text-gray-500">{authState.user.email}</p>
            <div className="mt-3">
              <CurrencySelector />
            </div>
          </div>
        )}

        <nav className="mt-2 px-2">
          <ul className="space-y-1">
            {[
              { to: '/', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
              { to: '/expenses', label: 'Expenses', icon: <BarChart3 className="h-4 w-4" /> },
              { to: '/budgets', label: 'Budgets', icon: <PieChart className="h-4 w-4" /> },
              { to: '/add', label: 'Add Expense', icon: <PlusCircle className="h-4 w-4" /> },
              { to: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
            ].map(({ to, label, icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <main className="p-6 max-w-7xl mx-auto animate-slide-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
