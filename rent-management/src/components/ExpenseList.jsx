
import React from 'react';

function ExpenseList({ expenses }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{expense.property_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">{expense.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;
