
import React from 'react';

function RentLogFilters({ filters, onFilterChange }) {
  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <label htmlFor="status" className="mr-2">Status:</label>
        <select id="status" value={filters.status} onChange={handleStatusChange}>
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="due">Due</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search by tenant or property"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default RentLogFilters;
