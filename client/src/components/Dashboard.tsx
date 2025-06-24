import React from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  AlertCircle, 
  Wallet, 
  ShoppingBag, 
  Home, 
  Utensils, 
  Car, 
  Heart, 
  Music,
  FileText
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency } from '../context/currencyContext';
import { useState } from 'react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food':
      return <Utensils className="h-5 w-5" />;
    case 'shopping':
      return <ShoppingBag className="h-5 w-5" />;
    case 'housing':
      return <Home className="h-5 w-5" />;
    case 'transportation':
      return <Car className="h-5 w-5" />;
    case 'healthcare':
      return <Heart className="h-5 w-5" />;
    case 'entertainment':
      return <Music className="h-5 w-5" />;
    default:
      return <Wallet className="h-5 w-5" />;
  }
};

const Card = ({ title, icon, value, subtitle, imageUrl }: { 
  title: string; 
  icon: React.ReactNode; 
  value: string; 
  subtitle: string;
  imageUrl: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl hover:shadow-2xl hover:shadow-gray-800/10 transition-all duration-300 group cursor-pointer">
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300"
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
    <div className="relative p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-300">{title}</h3>
        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-all duration-300">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300">{value}</p>
      <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{subtitle}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children, imageUrl }: { title: string; children: React.ReactNode; imageUrl: string }) => (
  <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.01] hover:border-primary-100 transition-all duration-300">
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity duration-300"
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
    <div className="relative p-6 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
      <h3 className="text-base font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  </div>
);

const NoDataMessage = () => (
  <div className="h-full flex flex-col items-center justify-center">
    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-3">
      <Wallet className="h-8 w-8 text-gray-400" />
    </div>
    <p className="text-sm text-gray-500">No data for current month</p>
  </div>
);

const BudgetStatusSection = ({ budgetStatus }: { budgetStatus: { category: string; percentage: number }[] }) => (
  <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.01] hover:border-primary-100 transition-all duration-300">
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity duration-300"
      style={{ backgroundImage: `url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80)` }}
    />
    <div className="relative p-6 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
      <h3 className="text-base font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">Budget Status</h3>
      <ul className="space-y-4">
        {budgetStatus.map(status => (
          <li key={status.category} className="hover:scale-[1.01] transition-transform duration-200">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg mr-2">
                  {getCategoryIcon(status.category)}
                </div>
                <span className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200">{status.category}</span>
              </div>
              <span className="text-sm text-gray-500">{status.percentage}% used</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  status.percentage > 90
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    : status.percentage > 70
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
                style={{ width: `${Math.min(status.percentage, 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const BudgetAlertsSection = ({ budgetAlerts }: { budgetAlerts: { category: string; percentage: number }[] }) => (
  <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.01] hover:border-primary-100 transition-all duration-300">
    <div className="relative p-6 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Budget Alerts</h3>
        {budgetAlerts.length > 0 && (
          <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-red-50 text-red-600 text-xs font-medium rounded-full">
            {budgetAlerts.length} {budgetAlerts.length === 1 ? 'Alert' : 'Alerts'}
          </span>
        )}
      </div>
      {budgetAlerts.length > 0 ? (
        <ul className="space-y-3">
          {budgetAlerts.map(alert => (
            <li key={alert.category} className="flex items-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg hover:from-red-100 hover:to-red-200 hover:scale-[1.02] transition-all duration-200 cursor-pointer group">
              <div className="p-2 bg-red-100 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-red-700 transition-colors duration-200">{alert.category}</p>
                <p className="text-xs text-red-600 group-hover:text-red-700 transition-colors duration-200">
                  Budget is {alert.percentage}% used
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-full mb-3">
            <AlertCircle className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">All budgets are within limits</p>
          <p className="text-xs text-gray-500 mt-1">You'll be notified when any budget reaches 80%</p>
        </div>
      )}
    </div>
  </div>
);

const RecentTransactionsSection = ({
  recentTransactions,
  currency,
}: {
  recentTransactions: { id: string; description: string; amount: number; date: string; category: string }[];
  currency: string;
}) => (
  <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.01] hover:border-primary-100 transition-all duration-300">
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity duration-300"
      style={{ backgroundImage: `url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80)` }}
    />
    <div className="relative p-6 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
      <h3 className="text-base font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">Recent Transactions</h3>
      {recentTransactions.length > 0 ? (
        <ul className="space-y-3">
          {recentTransactions.map(transaction => (
            <li 
              key={transaction.id} 
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  {getCategoryIcon(transaction.category)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{transaction.description}</p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">{format(new Date(transaction.date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{formatCurrency(transaction.amount, currency)}</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">{transaction.category}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-3">
            <Wallet className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No recent transactions</p>
        </div>
      )}
    </div>
  </div>
);

const CategoryBox = ({ 
  category, 
  icon, 
  amount, 
  currency, 
  isSelected, 
  onClick 
}: { 
  category: string; 
  icon: React.ReactNode; 
  amount: number; 
  currency: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div 
    onClick={onClick}
    className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
      isSelected 
        ? 'bg-gradient-to-br from-gray-800 to-gray-700 text-white shadow-lg scale-105' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 hover:text-gray-800 hover:shadow-md'
    }`}
  >
    <div className={`p-3 rounded-lg mb-2 ${
      isSelected 
        ? 'bg-white/20' 
        : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300'
    }`}>
      {React.cloneElement(icon as React.ReactElement, {
        className: `h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`
      })}
    </div>
    <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700 group-hover:text-gray-800'}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
    <span className={`text-lg font-semibold mt-1 ${isSelected ? 'text-white' : 'text-gray-900 group-hover:text-gray-800'}`}>
      {formatCurrency(amount, currency)}
    </span>
  </div>
);

const CategoryTransactions = ({ 
  transactions, 
  currency 
}: { 
  transactions: { id: string; description: string; amount: number; date: string; category: string }[];
  currency: string;
}) => (
  <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-lg font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
      Category Transactions
    </h3>
    {transactions.length > 0 ? (
      <div className="space-y-3">
        {transactions.map(transaction => (
          <div 
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg group-hover:scale-110 transition-transform duration-200">
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              {formatCurrency(transaction.amount, currency)}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500">No transactions in this category</p>
      </div>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const { state } = useExpenses();
  const { expenses, budgets } = state;
  const { currency } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);

  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= firstDayOfMonth && expenseDate <= lastDayOfMonth;
  });

  // Filter expenses for last 7 days
  const last7DaysExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const sevenDaysAgo = subDays(today, 7);
    return expenseDate >= sevenDaysAgo && expenseDate <= today;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const last7DaysTotal = last7DaysExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate spending by category for current month
  const spendingByCategory = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Prepare budget status info
  const budgetStatus = budgets.map(budget => {
    const spent = spendingByCategory[budget.category] || 0;
    const percentage = Math.round((spent / budget.amount) * 100);
    return {
      category: budget.category,
      budget: budget.amount,
      spent,
      remaining: budget.amount - spent,
      percentage
    };
  });

  // Pie chart data for spending by category
  const pieChartData = {
    labels: Object.keys(spendingByCategory).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [{
      data: Object.values(spendingByCategory),
      backgroundColor: [
        '#6366F1', '#10B981', '#F59E0B', '#EF4444',
        '#3B82F6', '#8B5CF6', '#14B8A6', '#F43F5E',
        '#22D3EE', '#A855F7'
      ],
      borderWidth: 1,
    }],
  };

  // Last 7 days dates array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    return {
      date,
      dateString: date.toISOString().split('T')[0],
      label: format(date, 'EEE')
    };
  });

  // Bar chart data for daily expenses in last 7 days
  const barChartData = {
    labels: last7Days.map(day => day.label),
    datasets: [{
      label: 'Daily Expenses',
      data: last7Days.map(day =>
        expenses
          .filter(exp => exp.date === day.dateString)
          .reduce((sum, exp) => sum + exp.amount, 0)
      ),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Last 7 Days Expenses' },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // Recent 5 transactions sorted by date desc
  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Budget alerts for categories above 80%
  const budgetAlerts = budgetStatus.filter(status => status.percentage >= 80);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryTransactions = selectedCategory
    ? expenses
        .filter(expense => expense.category === selectedCategory)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 relative">
      {/* Premium background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700/5 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1e_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="relative space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            title="Total Expenses" 
            icon={<DollarSign className="h-5 w-5 text-gray-700" />} 
            value={formatCurrency(totalExpenses, currency)} 
            subtitle="All time"
            imageUrl="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80"
          />
          <Card 
            title="This Month" 
            icon={<Calendar className="h-5 w-5 text-gray-700" />} 
            value={formatCurrency(currentMonthTotal, currency)} 
            subtitle={format(firstDayOfMonth, 'MMMM yyyy')}
            imageUrl="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80"
          />
          <Card 
            title="Last 7 Days" 
            icon={<TrendingUp className="h-5 w-5 text-gray-700" />} 
            value={formatCurrency(last7DaysTotal, currency)} 
            subtitle={`${format(subDays(today, 7), 'MMM dd')} - ${format(today, 'MMM dd')}`}
            imageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
          />
          <Card 
            title="Avg. Daily (This Month)" 
            icon={<TrendingDown className="h-5 w-5 text-gray-700" />} 
            value={formatCurrency(currentMonthTotal / Math.max(today.getDate(), 1), currency)} 
            subtitle="Per day"
            imageUrl="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
            Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['food', 'shopping', 'housing', 'transportation', 'healthcare', 'entertainment'].map(category => (
              <CategoryBox
                key={category}
                category={category}
                icon={getCategoryIcon(category)}
                amount={categoryTotals[category] || 0}
                currency={currency}
                isSelected={selectedCategory === category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              />
            ))}
          </div>
          {selectedCategory && (
            <CategoryTransactions 
              transactions={categoryTransactions} 
              currency={currency} 
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
            <ChartCard 
              title="Spending by Category"
              imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
            >
              {Object.keys(spendingByCategory).length > 0 ? <Pie data={pieChartData} /> : <NoDataMessage />}
            </ChartCard>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
            <ChartCard 
              title="Daily Expenses"
              imageUrl="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80"
            >
              <Bar options={barChartOptions} data={barChartData} />
            </ChartCard>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
          <BudgetStatusSection budgetStatus={budgetStatus} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
            <RecentTransactionsSection recentTransactions={recentTransactions} currency={currency} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
            <BudgetAlertsSection budgetAlerts={budgetAlerts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
