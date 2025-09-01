import React, { useState, useEffect } from 'react';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import { getExpenses, addExpense } from '../services/expenseService';

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await getExpenses();
      if (error) {
        setError(error.message);
      } else {
        setExpenses(data);

        // compute total here
        const total = data.reduce((acc, expense) => acc + Number(expense.amount || 0), 0);
        setTotalExpense(total);
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
      const updatedExpenses = [...expenses, ...data];
      setExpenses(updatedExpenses);

      // update total
      const total = updatedExpenses.reduce((acc, expense) => acc + Number(expense.amount || 0), 0);
      setTotalExpense(total);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Expense Tracker</h1>

        {/* Total Expense Display */}
        <div className="mb-6 p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold text-gray-800">
            Total Expenses: <span className="text-red-600">Ksh {totalExpense}</span>
          </h2>
        </div>

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
