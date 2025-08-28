import { useState, useEffect, useCallback } from 'react';
import { getRentRoll, getFinanceKpis } from '../services/financeService.js';
import { getProperties, getUnits } from '../services/propertyManagementService.js';

// Finance ViewModel: manages filters, loads data, and exposes export-ready rows
export const useFinance = () => {
  // Filters (monthly-only)
  const today = new Date();
  const [filters, setFilters] = useState({
    propertyId: '',
    unitId: '',
    month: today.getUTCMonth() + 1,
    year: today.getUTCFullYear()
  });

  // Options for filters
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Data state
  const [rentRoll, setRentRoll] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load filter options from existing services
  const loadOptions = useCallback(async () => {
    try {
      setLoadingOptions(true);
      const [propsResult, unitsResult] = await Promise.all([
        getProperties(),
        getUnits()
      ]);
      if (propsResult.error) throw new Error(propsResult.error);
      if (unitsResult.error) throw new Error(unitsResult.error);
      setProperties(propsResult.data || []);
      setUnits(unitsResult.data || []);
    } catch (err) {
      console.error('Error loading finance options:', err);
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  // Load finance data (rent roll + KPIs)
  const loadFinance = useCallback(async (customFilters = null) => {
    try {
      setLoading(true);
      setError(null);

      const filtersToUse = customFilters || filters;
      const [{ data: rows, error: rrErr }, { data: kpiData, error: kpiErr }] = await Promise.all([
        getRentRoll(filtersToUse),
        getFinanceKpis(filtersToUse)
      ]);

      if (rrErr) throw new Error(rrErr);
      if (kpiErr) throw new Error(kpiErr);

      setRentRoll(rows || []);
      setKpis(kpiData || null);
    } catch (err) {
      console.error('Error loading finance data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    loadFinance();
  }, [loadFinance]);

  const updateFilters = useCallback((partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ propertyId: '', unitId: '', month: today.getUTCMonth() + 1, year: today.getUTCFullYear() });
  }, [today]);

  return {
    // Filters
    filters,
    updateFilters,
    clearFilters,

    // Options
    properties,
    units,
    loadingOptions,

    // Data
    rentRoll,
    kpis,
    loading,
    error,

    // Operations
    loadFinance
  };
};


