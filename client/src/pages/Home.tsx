import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BarChart, Settings, ArrowRight, TrendingUp, Shield, Smartphone, Bell } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 relative">
      {/* Premium background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700/5 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1e_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="relative">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Welcome to Expense Tracker
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Take control of your finances with our powerful expense tracking tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl hover:shadow-2xl hover:shadow-gray-800/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-100 rounded-lg mr-4">
                  <PlusCircle className="h-6 w-6 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Add Expenses</h2>
              </div>
              <p className="text-gray-600 mb-4">Track your daily expenses and keep your budget in check</p>
              <Link 
                to="/add-expense" 
                className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl hover:shadow-2xl hover:shadow-gray-800/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-100 rounded-lg mr-4">
                  <BarChart className="h-6 w-6 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">View Analytics</h2>
              </div>
              <p className="text-gray-600 mb-4">Analyze your spending patterns and make informed decisions</p>
              <Link 
                to="/dashboard" 
                className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
              >
                View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl hover:shadow-2xl hover:shadow-gray-800/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-100 rounded-lg mr-4">
                  <Settings className="h-6 w-6 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Manage Budgets</h2>
              </div>
              <p className="text-gray-600 mb-4">Set and manage your monthly budgets for different categories</p>
              <Link 
                to="/budgets" 
                className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
              >
                Manage Budgets <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              Why Choose Our Expense Tracker?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
                <div className="p-3 bg-gray-100 rounded-lg inline-block mb-4">
                  <TrendingUp className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Analytics</h3>
                <p className="text-gray-600">Get insights into your spending habits with detailed analytics</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
                <div className="p-3 bg-gray-100 rounded-lg inline-block mb-4">
                  <Shield className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your financial data is always protected and private</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
                <div className="p-3 bg-gray-100 rounded-lg inline-block mb-4">
                  <Smartphone className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Mobile Friendly</h3>
                <p className="text-gray-600">Access your expenses anywhere, anytime</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
                <div className="p-3 bg-gray-100 rounded-lg inline-block mb-4">
                  <Bell className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Alerts</h3>
                <p className="text-gray-600">Get notified about your budget limits and spending patterns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 