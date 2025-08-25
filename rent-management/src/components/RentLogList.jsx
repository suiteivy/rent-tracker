
import React from 'react';

function RentLogList({ rentLogs, onUpdateStatus }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rentLogs.map((log) => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap">{log.tenant_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{log.property_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{log.due_date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{log.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.status === 'paid' ? 'bg-green-100 text-green-800' : log.status === 'due' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {log.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {log.status !== 'paid' && (
                  <button
                    onClick={() => onUpdateStatus(log.id, 'paid')}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Mark as Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RentLogList;
