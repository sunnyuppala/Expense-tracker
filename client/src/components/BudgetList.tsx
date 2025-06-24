import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, PlusCircle, AlertCircle } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency } from '../context/currencyContext';

const BudgetList: React.FC = () => {
  const { state, deleteBudget } = useExpenses();
  const { budgets, expenses } = state;
  const { currency } = useCurrency();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const formatAmount = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
  const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
  
  const currentMonthExpenses = expenses.filter(
    expense => expense.date >= startOfMonth && expense.date <= endOfMonth
  );

  const spendingByCategory = currentMonthExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) acc[expense.category] = 0;
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleDelete = async (category: string) => {
    try {
      await deleteBudget(category);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  // Calculate budget alerts
  const budgetAlerts = budgets.filter(budget => {
    const spent = spendingByCategory[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    return percentage >= 80;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Monthly Budgets</h2>
        <Link
          to="/budgets/add"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Budget
        </Link>
      </div>

      {/* Budget Alerts Section */}
      {budgetAlerts.length > 0 && (
        <div className="bg-rose-900/50 border border-rose-500 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-rose-400 mb-3 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Budget Alerts
          </h3>
          <div className="space-y-2">
            {budgetAlerts.map(budget => {
              const spent = spendingByCategory[budget.category] || 0;
              const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100);
              return (
                <div key={budget.category} className="flex items-center justify-between text-rose-200">
                  <span className="capitalize">{budget.category}</span>
                  <span>{percentage}% used</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Budget List */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => {
            const spent = spendingByCategory[budget.category] || 0;
            const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100);
            const isOverBudget = spent > budget.amount;
            const isNearLimit = percentage >= 80;
            
            return (
              <div key={budget.category} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <div className="p-4 border-b border-slate-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white capitalize">{budget.category}</h3>
                    <div className="flex space-x-2">
                      <Link
                        to={`/budgets/edit/${budget.category}`}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      {showDeleteConfirm === budget.category ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(budget.category)}
                            className="text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-slate-400 hover:text-slate-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(budget.category)}
                          className="text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Budget:</span>
                    <span className="font-medium text-white">{formatAmount(budget.amount)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Spent:</span>
                    <span className={`font-medium ${isOverBudget ? 'text-rose-400' : 'text-white'}`}>
                      {formatAmount(spent)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Remaining:</span>
                    <span className={`font-medium ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {formatAmount(budget.amount - spent)}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          isOverBudget
                            ? 'bg-rose-500'
                            : isNearLimit
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-slate-400">0%</span>
                      <span className={`text-xs ${
                        isOverBudget
                          ? 'text-rose-400'
                          : isNearLimit
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {percentage}%
                      </span>
                      <span className="text-xs text-slate-400">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-400 mb-4">No budgets found. Set your first budget!</p>
          <Link
            to="/budgets/add"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Budget
          </Link>
        </div>
      )}
    </div>
  );
};

export default BudgetList;

