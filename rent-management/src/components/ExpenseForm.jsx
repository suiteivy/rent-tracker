
import React, { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
  const [expense, setExpense] = useState({
    date: '',
    property_name: '',
    category: '',
    amount: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense(expense);
    setExpense({
      date: '',
      property_name: '',
      category: '',
      amount: '',
      description: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="date" name="date" value={expense.date} onChange={handleChange} className="p-2 border rounded" />
        <input type="text" name="property_name" value={expense.property_name} onChange={handleChange} placeholder="Property Name" className="p-2 border rounded" />
        <input type="text" name="category" value={expense.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" />
        <input type="number" name="amount" value={expense.amount} onChange={handleChange} placeholder="Amount" className="p-2 border rounded" />
        <textarea name="description" value={expense.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded md:col-span-2"></textarea>
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
