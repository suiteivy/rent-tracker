import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function ExpenseForm({ onAddExpense }) {
  const [expense, setExpense] = useState({
    property_id: '',
    amount: '',
    category: '',
    description: ''
  });
  const [properties, setProperties] = useState([]);

  // Fetch properties for dropdown
  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase.from('properties').select('id, name');
      if (!error) setProperties(data);
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense(expense);
    setExpense({ property_id: '', amount: '', category: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Dropdown */}
        <select
          name="property_id"
          value={expense.property_id}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Property</option>
          {properties.map((prop) => (
            <option key={prop.id} value={prop.id}>
              {prop.name}
            </option>
          ))}
        </select>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="p-2 border rounded"
          required
        />
        {/* Category */}
        <textarea
          name="category"
          value={expense.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded md:col-span-2"
        />

        {/* Description */}
        <textarea
          name="description"
          value={expense.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded md:col-span-2"
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
        Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm;
