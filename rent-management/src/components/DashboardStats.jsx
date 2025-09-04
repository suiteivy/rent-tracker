import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { formatCurrency } from '../utils/formatters';
import { supabase } from '../supabaseClient'; 
import IncomeExpensePieChart from './PieChart'; 

/**
 * Dashboard statistics component
 */
const DashboardStats = ({ stats }) => {
  const [totalExpenses, setTotalExpenses] = useState(0);

  //  Fetch expenses directly from Supabase
  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase.from('expenses').select('amount');

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      const total = data.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalExpenses(total);
    };

    fetchExpenses();
  }, []);

  if (!stats) return null;

  const netIncome =
    (stats.totalMonthlyRentFromLeases || 0) - (totalExpenses || 0);

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'airbnb-blue',
    },
    {
      title: 'Total Units',
      value: stats.totalUnits,
      subtitle: `${stats.availableUnits} available`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      color: 'airbnb-green',
    },
    {
      title: 'Active Leases',
      value: stats.totalActiveLeases || 0,
      subtitle: `${stats.totalTenants || 0} total tenants`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'airbnb-purple',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(stats.totalMonthlyRentFromLeases || 0),
      subtitle: `${stats.incomeEfficiency || 0}% efficiency`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'airbnb-red',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses || 0),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'airbnb-yellow',
    },
    {
      title: 'Net Income',
      value: formatCurrency(netIncome),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2 1.343 2 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'airbnb-green',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      {/* The pie chart */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Gross Income vs expenses vs Net income</h2>
        <IncomeExpensePieChart
          income={stats.totalMonthlyRentFromLeases || 0}
          expenses={totalExpenses || 0}
          netIncome={netIncome}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
