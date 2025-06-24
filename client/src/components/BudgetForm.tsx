import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Budget, CATEGORIES } from '../types';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency } from '../context/currencyContext';

interface BudgetFormProps {
  budget?: Budget;
  isEditing?: boolean;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ budget, isEditing = false }) => {
  const { addBudget, updateBudget, refreshData } = useExpenses();
  const { currency } = useCurrency();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: 'food',
    amount: ''
  });

  const [errors, setErrors] = useState({
    amount: '',
    server: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount.toString()
      });
    }
  }, [isEditing, budget]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      amount: '',
      server: ''
    };

    if (!formData.amount) {
      newErrors.amount = 'Budget amount is required';
      valid = false;
    } else if (isNaN(Number(formData.amount))) {
      newErrors.amount = 'Budget amount must be a number';
      valid = false;
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Budget amount must be greater than 0';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors.amount || errors.server) {
      setErrors({ amount: '', server: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({ amount: '', server: '' });

    const budgetData = {
      category: formData.category,
      amount: parseFloat(formData.amount)
    };

    try {
      console.log('Submitting budget data:', budgetData);
      
      if (isEditing && budget) {
        const success = await updateBudget({
          ...budgetData,
          id: budget.id
        });
        if (success) {
          await refreshData();
          navigate('/budgets');
        } else {
          setErrors(prev => ({
            ...prev,
            server: 'Failed to update budget. Please try again.'
          }));
        }
      } else {
        const success = await addBudget(budgetData);
        if (success) {
          await refreshData();
          navigate('/budgets');
        } else {
          setErrors(prev => ({
            ...prev,
            server: 'Failed to add budget. Please try again.'
          }));
        }
      }
    } catch (error: any) {
      console.error('Error saving budget:', error);
      setErrors(prev => ({
        ...prev,
        server: error.message || 'Failed to save budget. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#232323] p-6 rounded-lg border border-[#2A2A2A]">
      <h2 className="text-lg font-medium text-white mb-4">
        {isEditing ? 'Edit Budget' : 'Add New Budget'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-xs text-[#8A8A8A] mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-md focus:outline-none focus:border-[#FF6363] text-white text-sm"
            disabled={isEditing || isSubmitting}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category} className="text-white">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-xs text-[#8A8A8A] mb-1">
            Monthly Budget Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-[#8A8A8A] text-sm">{currency}</span>
            </div>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full pl-7 px-3 py-2 bg-[#2A2A2A] border rounded-md text-sm ${
                errors.amount || errors.server ? 'border-[#FF6363]' : 'border-[#3A3A3A]'
              } focus:outline-none focus:border-[#FF6363] text-white`}
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-[#FF6363]">{errors.amount}</p>}
          {errors.server && <p className="mt-1 text-xs text-[#FF6363]">{errors.server}</p>}
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className={`px-4 py-2 bg-[#FF6363] text-white rounded-md hover:bg-[#FF5252] focus:outline-none focus:ring-2 focus:ring-[#FF6363] focus:ring-offset-2 focus:ring-offset-[#232323] text-sm ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Budget' : 'Add Budget'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/budgets')}
            className={`px-4 py-2 bg-[#2A2A2A] text-white rounded-md hover:bg-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#3A3A3A] focus:ring-offset-2 focus:ring-offset-[#232323] text-sm ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;


