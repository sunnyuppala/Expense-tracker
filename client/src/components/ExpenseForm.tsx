import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Expense, CATEGORIES } from '../types';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency } from '../context/currencyContext';

interface ExpenseFormProps {
  expense?: Expense;
  isEditing?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, isEditing = false }) => {
  const { addExpense, updateExpense } = useExpenses();
  const { currency } = useCurrency();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({
    description: '',
    amount: '',
    date: ''
  });

  useEffect(() => {
    if (isEditing && expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date
      });
    }
  }, [isEditing, expense]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      description: '',
      amount: '',
      date: ''
    };

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
      valid = false;
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
      valid = false;
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const expenseData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    };

    if (isEditing && expense) {
      updateExpense({ ...expenseData, id: expense.id });
    } else {
      addExpense(expenseData);
    }

    navigate('/expenses');
  };

  return (
    <div className="bg-blue-50 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">
        {isEditing ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-blue-800 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-black ${
              errors.description ? 'border-rose-500' : 'border-blue-200'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="What did you spend on?"
          />
          {errors.description && <p className="mt-1 text-sm text-rose-500">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-blue-800 mb-1">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-blue-400">{currency}</span>
            </div>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full pl-7 px-3 py-2 border rounded-md ${
                errors.amount ? 'border-rose-500' : 'border-blue-200'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="mt-1 text-sm text-rose-500">{errors.amount}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-blue-800 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category} className="text-black">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-blue-800 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-black ${
              errors.date ? 'border-rose-500' : 'border-blue-200'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.date && <p className="mt-1 text-sm text-rose-500">{errors.date}</p>}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="px-4 py-2 bg-blue-100 text-blue-400 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;






