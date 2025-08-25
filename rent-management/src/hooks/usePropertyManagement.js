import { useState, useEffect, useCallback } from 'react';
import { 
  getProperties, 
  getPropertiesWithUnitCount,
  getUnits,
  getPropertyById,
  getUnitById,
  createProperty,
  createUnit,
  updateProperty,
  updateUnit,
  deleteProperty,
  deleteUnit,
  getUniqueCounties,
  getUniqueCities,
  getDashboardStats
} from '../services/propertyManagementService.js';
import { getRentLogs, updateRentLog as updateRentLogInService } from '../services/rentLogService.js';

// Custom hook for property and unit management operations
export const usePropertyManagement = () => {
  // State for properties
  const [properties, setProperties] = useState([]);
  const [propertiesWithUnits, setPropertiesWithUnits] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [propertiesError, setPropertiesError] = useState(null);

  // State for units
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [unitsError, setUnitsError] = useState(null);

  // State for rent logs
  const [rentLogs, setRentLogs] = useState([]);
  const [loadingRentLogs, setLoadingRentLogs] = useState(false);
  const [rentLogsError, setRentLogsError] = useState(null);

  // State for filters and options
  const [filters, setFilters] = useState({
    search: '',
    county: '',
    city: '',
    propertyType: '',
    unitType: '',
    isAvailable: undefined,
    minRent: '',
    maxRent: ''
  });
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  // State for operations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operationError, setOperationError] = useState(null);

  // ========================================
  // PROPERTY OPERATIONS
  // ========================================

  // Load all properties
  const loadProperties = useCallback(async (customFilters = null) => {
    try {
      setLoadingProperties(true);
      setPropertiesError(null);
      
      const filtersToUse = customFilters || filters;
      const { data, error } = await getProperties(filtersToUse);
      
      if (error) throw new Error(error);
      
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      setPropertiesError(error.message);
    } finally {
      setLoadingProperties(false);
    }
  }, [filters]);

  // Load properties with unit counts
  const loadPropertiesWithUnits = useCallback(async (customFilters = null) => {
    try {
      setLoadingProperties(true);
      setPropertiesError(null);
      
      const filtersToUse = customFilters || filters;
      const { data, error } = await getPropertiesWithUnitCount(filtersToUse);
      
      if (error) throw new Error(error);
      
      setPropertiesWithUnits(data || []);
    } catch (error) {
      console.error('Error loading properties with units:', error);
      setPropertiesError(error.message);
    } finally {
      setLoadingProperties(false);
    }
  }, [filters]);

  // Load single property by ID
  const loadPropertyById = useCallback(async (propertyId) => {
    try {
      setLoadingProperties(true);
      setPropertiesError(null);
      
      const { data, error } = await getPropertyById(propertyId);
      
      if (error) throw new Error(error);
      
      setSelectedProperty(data);
      return data;
    } catch (error) {
      console.error('Error loading property:', error);
      setPropertiesError(error.message);
      return null;
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  // Create new property
  const addProperty = useCallback(async (propertyData) => {
    try {
      setIsSubmitting(true);
      setOperationError(null);
      
      const { data, error } = await createProperty(propertyData);
      
      if (error) throw new Error(error);
      
      // Refresh properties list
      await loadProperties();
      await loadPropertiesWithUnits();
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating property:', error);
      setOperationError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadProperties, loadPropertiesWithUnits]);

  // Update property
  const updatePropertyById = useCallback(async (propertyId, updateData) => {
    try {
      setIsSubmitting(true);
      setOperationError(null);
      
      const { data, error } = await updateProperty(propertyId, updateData);
      
      if (error) throw new Error(error);
      
      // Refresh properties list
      await loadProperties();
      await loadPropertiesWithUnits();
      
      // Update selected property if it's the one being updated
      if (selectedProperty && selectedProperty.id === propertyId) {
        setSelectedProperty(data);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error updating property:', error);
      setOperationError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadProperties, loadPropertiesWithUnits, selectedProperty]);

  // Delete property
  const removeProperty = useCallback(async (propertyId) => {
    try {
      setIsSubmitting(true);
      setOperationError(null);
      
      const { success, error } = await deleteProperty(propertyId);
      
      if (error) throw new Error(error);
      
      // Refresh properties list
      await loadProperties();
      await loadPropertiesWithUnits();
      
      // Clear selected property if it's the one being deleted
      if (selectedProperty && selectedProperty.id === propertyId) {
        setSelectedProperty(null);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting property:', error);
      setOperationError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadProperties, loadPropertiesWithUnits, selectedProperty]);

  // ========================================
  // UNIT OPERATIONS
  // ========================================

  // Load all units
  const loadUnits = useCallback(async (customFilters = null) => {
    try {
      setLoadingUnits(true);
      setUnitsError(null);
      
      const filtersToUse = customFilters || filters;
      const { data, error } = await getUnits(filtersToUse);
      
      if (error) throw new Error(error);
      
      setUnits(data || []);
    } catch (error) {
      console.error('Error loading units:', error);
      setUnitsError(error.message);
    } finally {
      setLoadingUnits(false);
    }
  }, [filters]);

  // Load single unit by ID
  const loadUnitById = useCallback(async (unitId) => {
    try {
      setLoadingUnits(true);
      setUnitsError(null);
      
      const { data, error } = await getUnitById(unitId);
      
      if (error) throw new Error(error);
      
      setSelectedUnit(data);
      return data;
    } catch (error) {
      console.error('Error loading unit:', error);
      setUnitsError(error.message);
      return null;
    } finally {
      setLoadingUnits(false);
    }
  }, []);

  // Create new unit
  const addUnit = useCallback(async (unitData) => {
    try {
      setIsSubmitting(true);
      setOperationError(null);
      
      const { data, error } = await createUnit(unitData);
      
      if (error) throw new Error(error);
      
      // Refresh units list
      await loadUnits();
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating unit:', error);
      setOperationError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUnits]);

  // Update unit
  const updateUnitById = useCallback(async (unitId, updateData) => {
    try {
      setIsSubmitting(true);
      setOperationError(null);
      
      const { data, error } = await updateUnit(unitId, updateData);
      
      if (error) throw new Error(error);
      
      // Refresh units list
      await loadUnits();
      
      // Update selected unit if it's the one being updated
      if (selectedUnit && selectedUnit.id === unitId) {
        setSelectedUnit(data);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error updating unit:', error);
      setOperationError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUnits, selectedUnit]);

  // Delete unit
  const removeUnit = useCallback(async (unitId) => {
    try {
      setIsSubmitting(true);
      setOperationError(null);
      
      const { success, error } = await deleteUnit(unitId);
      
      if (error) throw new Error(error);
      
      // Refresh units list
      await loadUnits();
      
      // Clear selected unit if it's the one being deleted
      if (selectedUnit && selectedUnit.id === unitId) {
        setSelectedUnit(null);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting unit:', error);
      setOperationError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadUnits, selectedUnit]);

  // ========================================
  // FILTERS AND OPTIONS
  // ========================================

  // Load filter options (counties, cities)
  const loadFilterOptions = useCallback(async () => {
    try {
      setLoadingOptions(true);
      
      const [countiesResult, citiesResult] = await Promise.all([
        getUniqueCounties(),
        getUniqueCities()
      ]);
      
      if (countiesResult.data) setCounties(countiesResult.data);
      if (citiesResult.data) setCities(citiesResult.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      county: '',
      city: '',
      propertyType: '',
      unitType: '',
      isAvailable: undefined,
      minRent: '',
      maxRent: ''
    });
  }, []);

  // ========================================
  // DASHBOARD STATS
  // ========================================

  // Load dashboard statistics
  const loadDashboardStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      setStatsError(null);
      
      const { data, error } = await getDashboardStats();
      
      if (error) throw new Error(error);
      
      setDashboardStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setStatsError(error.message);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  // Clear all errors
  const clearErrors = useCallback(() => {
    setPropertiesError(null);
    setUnitsError(null);
    setStatsError(null);
    setOperationError(null);
  }, []);

  // Clear selected items
  const clearSelected = useCallback(() => {
    setSelectedProperty(null);
    setSelectedUnit(null);
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadProperties(),
      loadPropertiesWithUnits(),
      loadUnits(),
      loadDashboardStats()
    ]);
  }, [loadProperties, loadPropertiesWithUnits, loadUnits, loadDashboardStats]);

  // ========================================
  // RENT LOG OPERATIONS
  // ========================================

  const loadRentLogs = useCallback(async (customFilters = null) => {
    try {
      setLoadingRentLogs(true);
      setRentLogsError(null);
      const { data, error } = await getRentLogs(customFilters || {});
      if (error) throw new Error(error);
      setRentLogs(data || []);
    } catch (error) {
      console.error('Error loading rent logs:', error);
      setRentLogsError(error.message);
    } finally {
      setLoadingRentLogs(false);
    }
  }, []);

  const updateRentLog = useCallback(async (logId, updates) => {
    try {
      setIsSubmitting(true);
      setOperationError(null);
      const { data, error } = await updateRentLogInService(logId, updates);
      if (error) throw new Error(error);
      await loadRentLogs();
      return { success: true, data };
    } catch (error) {
      console.error('Error updating rent log:', error);
      setOperationError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [loadRentLogs]);

  // ========================================
  // RETURN OBJECT
  // ========================================

  return {
    // Properties
    properties,
    propertiesWithUnits,
    selectedProperty,
    loadingProperties,
    propertiesError,
    
    // Units
    units,
    selectedUnit,
    loadingUnits,
    unitsError,
    
    // Filters and options
    filters,
    counties,
    cities,
    loadingOptions,
    
    // Dashboard stats
    dashboardStats,
    loadingStats,
    statsError,
    
    // Operations
    isSubmitting,
    operationError,
    
    // Property operations
    loadProperties,
    loadPropertiesWithUnits,
    loadPropertyById,
    addProperty,
    updatePropertyById,
    removeProperty,
    
    // Unit operations
    loadUnits,
    loadUnitById,
    addUnit,
    updateUnitById,
    removeUnit,
    
    // Filter operations
    loadFilterOptions,
    updateFilters,
    clearFilters,
    
    // Dashboard operations
    loadDashboardStats,
    
    // Utility operations
    clearErrors,
    clearSelected,
    refreshAll,

    // Rent Log operations
    rentLogs,
    loadingRentLogs,
    rentLogsError,
    loadRentLogs,
    updateRentLog
  };
}; 