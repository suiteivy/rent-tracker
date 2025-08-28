
import React, { useState, useEffect } from 'react';
import { usePropertyManagement } from '../hooks/usePropertyManagement';
import RentLogFilters from '../components/RentLogFilters';
import RentLogList from '../components/RentLogList';

function RentLogPage() {
  const {
    rentLogs,
    loadingRentLogs,
    rentLogsError,
    loadRentLogs,
    updateRentLog,
  } = usePropertyManagement();

  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });

  useEffect(() => {
    loadRentLogs(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleUpdateStatus = async (logId, newStatus) => {
    await updateRentLog(logId, { status: newStatus });
  };

  return (
    <div className="min-h-screen bg-airbnb-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-airbnb-900 mb-4">Rent Log</h1>
          <p className="text-xl text-airbnb-600">Track and manage rent payments.</p>
        </div>

        <div className="mb-8">
          <RentLogFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {loadingRentLogs ? (
          <p>Loading...</p>
        ) : rentLogsError ? (
          <p>Error: {rentLogsError}</p>
        ) : (
          <RentLogList rentLogs={rentLogs} onUpdateStatus={handleUpdateStatus} />
        )}
      </div>
    </div>
  );
}

export default RentLogPage;
