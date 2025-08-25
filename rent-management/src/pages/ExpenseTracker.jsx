import React, { useState, useEffect } from 'react';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import { getExpenses, addExpense } from '../services/expenseService';

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await getExpenses();
      if (error) {
        setError(error.message);
      } else {
        setExpenses(data);
      }
      setLoading(false);
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (expense) => {
    const { data, error } = await addExpense(expense);
    if (error) {
      setError(error.message);
    } else {
      setExpenses([...expenses, ...data]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Expense Tracker</h1>
        <ExpenseForm onAddExpense={handleAddExpense} />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ExpenseList expenses={expenses} />
        )}
      </div>
    </div>
  );
}

export default ExpenseTracker;