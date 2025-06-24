import React, { useState } from 'react';
import { useCurrency } from '../context/currencyContext';
import { ChevronDown } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' }
];

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
      >
        <span className="flex items-center">
          <span className="mr-2">{selectedCurrency.symbol}</span>
          <span>{selectedCurrency.code}</span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-slate-700 rounded-md shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm ${
                  currency === curr.code
                    ? 'bg-slate-600 text-emerald-400'
                    : 'text-white hover:bg-slate-600'
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-2">{curr.symbol}</span>
                  <span>{curr.code}</span>
                  <span className="ml-2 text-slate-400 text-xs">({curr.name})</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector; 