 import { supabase } from '../supabaseClient.js';

 /**
 * Get the current logged-in user safely
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  return data?.user || null;
};

/**
 * Insert a row with user_id automatically attached
 */
export const insertWithUser = async (table, row) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not logged in");

    const rowWithUser = { ...row, user_id: user.id };

    const { data, error } = await supabase
      .from(table)
      .insert([rowWithUser])
      .select();

    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error(`Insert failed for ${table}:`, err.message);
    return null; // prevent crash
  }
};
/**
 * Create a property
 */
export const createProperty = async (propertyData) => {
  const propertyToInsert = {
    name: propertyData.name.trim(),
    address: propertyData.address.trim(),
    city: propertyData.city.trim(),
    county: propertyData.county.trim(),
    postal_code: propertyData.postalCode?.trim() || null,
    phone_number: propertyData.phoneNumber?.trim() || null,
    property_type: propertyData.propertyType || 'residential',
    description: propertyData.description?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return await insertWithUser('properties', propertyToInsert);
};

// Get all properties
export const getProperties = async (filters = {}) => {
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    // apply filters if provided
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters.county) {
      query = query.eq('county', filters.county);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching properties:', error);
      throw new Error(error.message);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { data: [], error: error.message };
  }
};

// Get property by ID
export const getPropertyById = async (propertyId) => {
  try {
    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error) {
      console.error('Supabase error fetching property:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching property:', error);
    return { data: null, error: error.message };
  }
};

/**
 * UPDATE A PROPERTY
 * @param {string} propertyId - property ID
 * @param {Object} updateData - updated property data
 * @returns {Object} - { data, error }
 */
export const updateProperty = async (propertyId, updateData) => {
  try {
    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    // validate required fields
    const requiredFields = ['name', 'address', 'city', 'county'];
    for (const field of requiredFields) {
      if (updateData[field] && !updateData[field].trim()) {
        throw new Error(`${field} cannot be empty`);
      }
    }

    // prepare update data
    const propertyToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // clean up the data
    if (propertyToUpdate.name) propertyToUpdate.name = propertyToUpdate.name.trim();
    if (propertyToUpdate.address) propertyToUpdate.address = propertyToUpdate.address.trim();
    if (propertyToUpdate.city) propertyToUpdate.city = propertyToUpdate.city.trim();
    if (propertyToUpdate.county) propertyToUpdate.county = propertyToUpdate.county.trim();
    if (propertyToUpdate.postalCode) propertyToUpdate.postal_code = propertyToUpdate.postalCode.trim();
    if (propertyToUpdate.phoneNumber) propertyToUpdate.phone_number = propertyToUpdate.phoneNumber.trim();
    if (propertyToUpdate.description) propertyToUpdate.description = propertyToUpdate.description.trim();

    // remove postalCode and phoneNumber from the update object as they're mapped to postal_code and phone_number
    delete propertyToUpdate.postalCode;
    delete propertyToUpdate.phoneNumber;

    const { data, error } = await supabase
      .from('properties')
      .update(propertyToUpdate)
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating property:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating property:', error);
    return { data: null, error: error.message };
  }
};

/**
 * DELETE A PROPERTY
 * @param {string} propertyId - property ID
 * @returns {Object} - { success, error }
 */
export const deleteProperty = async (propertyId) => {
  try {
    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    // check if property has units before deleting
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id')
      .eq('property_id', propertyId);

    if (unitsError) {
      console.error('Error checking units:', unitsError);
      throw new Error('Failed to check if property has units');
    }

    if (units && units.length > 0) {
      throw new Error('Cannot delete property that has units. Please delete all units first.');
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Supabase error deleting property:', error);
      throw new Error(error.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false, error: error.message };
  }
};

// UNIT CRUD OPERATIONS

/**
 * CREATE A NEW UNIT
 * @param {Object} unitData - unit data object
 * @returns {Object} - { data, error }
 */
/**
 * Create a unit
 */
export const createUnit = async (unitData) => {
  const unitToInsert = {
    property_id: unitData.propertyId,
    unit_number: unitData.unitNumber.trim(),
    unit_type: unitData.unitType || 'apartment',
    bedrooms: unitData.bedrooms || 0,
    bathrooms: unitData.bathrooms || 0,
    square_feet: unitData.squareFeet || null,
    rent_amount: unitData.rentAmount,
    rent_currency: unitData.rentCurrency || 'KES',
    deposit_amount: unitData.depositAmount || null,
    deposit_currency: unitData.depositCurrency || 'KES',
    is_available: unitData.isAvailable !== undefined ? unitData.isAvailable : true,
    description: unitData.description?.trim() || null,
    amenities: unitData.amenities || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return await insertWithUser('units', unitToInsert);
};

/**
 * GET ALL UNITS WITH OPTIONAL FILTERING
 * @param {Object} filters - optional filters
 * @returns {Object} - { data, error }
 */
export const getUnits = async (filters = {}) => {
  try {
    let query = supabase
      .from('units')
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city,
          county
        )
      `)
      .order('created_at', { ascending: false });

    // apply filters if provided
    if (filters.propertyId) {
      query = query.eq('property_id', filters.propertyId);
    }

    if (filters.unitType) {
      query = query.eq('unit_type', filters.unitType);
    }

    if (filters.isAvailable !== undefined) {
      query = query.eq('is_available', filters.isAvailable);
    }

    if (filters.minRent) {
      query = query.gte('rent_amount', filters.minRent);
    }

    if (filters.maxRent) {
      query = query.lte('rent_amount', filters.maxRent);
    }

    if (filters.search) {
      query = query.or(`unit_number.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching units:', error);
      throw new Error(error.message);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching units:', error);
    return { data: [], error: error.message };
  }
};

/**
 * GET A SINGLE UNIT BY ID
 * @param {string} unitId - unit ID
 * @returns {Object} - { data, error }
 */
export const getUnitById = async (unitId) => {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    const { data, error } = await supabase
      .from('units')
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city,
          county
        )
      `)
      .eq('id', unitId)
      .single();

    if (error) {
      console.error('Supabase error fetching unit:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching unit:', error);
    return { data: null, error: error.message };
  }
};

/**
 * UPDATE A UNIT
 * @param {string} unitId - unit ID
 * @param {Object} updateData - updated unit data
 * @returns {Object} - { data, error }
 */
export const updateUnit = async (unitId, updateData) => {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    // validate rent amount if provided
    if (updateData.rentAmount !== undefined && updateData.rentAmount <= 0) {
      throw new Error('Rent amount must be greater than 0');
    }

    // Prepare update data
    const unitToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Clean up the data
    if (unitToUpdate.unitNumber) unitToUpdate.unit_number = unitToUpdate.unitNumber.trim();
    if (unitToUpdate.propertyId) unitToUpdate.property_id = unitToUpdate.propertyId;
    if (unitToUpdate.description) unitToUpdate.description = unitToUpdate.description.trim();

    // Remove mapped fields
    delete unitToUpdate.unitNumber;
    delete unitToUpdate.propertyId;

    const { data, error } = await supabase
      .from('units')
      .update(unitToUpdate)
      .eq('id', unitId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating unit:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating unit:', error);
    return { data: null, error: error.message };
  }
};

/**
 * DELETE A UNIT
 * @param {string} unitId - unit ID
 * @returns {Object} - { success, error }
 */
export const deleteUnit = async (unitId) => {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', unitId);

    if (error) {
      console.error('Supabase error deleting unit:', error);
      throw new Error(error.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting unit:', error);
    return { success: false, error: error.message };
  }
};

// UTILITY FUNCTIONS

/**
 * GET UNIQUE COUNTIES FROM PROPERTIES
 * @returns {Object} - { data, error }
 */
export const getUniqueCounties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('county')
      .not('county', 'is', null);

    if (error) {
      console.error('Supabase error fetching counties:', error);
      throw new Error(error.message);
    }

    // extract unique counties
    const uniqueCounties = [...new Set(data.map(item => item.county))].sort();
    return { data: uniqueCounties, error: null };
  } catch (error) {
    console.error('Error fetching counties:', error);
    return { data: [], error: error.message };
  }
};

/**
 * GET UNIQUE CITIES FROM PROPERTIES
 * @returns {Object} - { data, error }
 */
export const getUniqueCities = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('city')
      .not('city', 'is', null);

    if (error) {
      console.error('Supabase error fetching cities:', error);
      throw new Error(error.message);
    }

    // Extract unique cities
    const uniqueCities = [...new Set(data.map(item => item.city))].sort();
    return { data: uniqueCities, error: null };
  } catch (error) {
    console.error('Error fetching cities:', error);
    return { data: [], error: error.message };
  }
};

/**
 * GET PROPERTY STATISTICS
 * @returns {Object} - { data, error }
 */
export const getPropertyStats = async () => {
  try {
    // get total properties
    const { count: totalProperties, error: propertiesError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    if (propertiesError) throw propertiesError;

    // Get total units
    const { count: totalUnits, error: unitsError } = await supabase
      .from('units')
      .select('*', { count: 'exact', head: true });

    if (unitsError) throw unitsError;

    // Get available units
    const { count: availableUnits, error: availableError } = await supabase
      .from('units')
      .select('*', { count: 'exact', head: true })
      .eq('is_available', true);

    if (availableError) throw availableError;

    // Get average rent
    const { data: rentData, error: rentError } = await supabase
      .from('units')
      .select('rent_amount')
      .not('rent_amount', 'is', null);

    if (rentError) throw rentError;

    const averageRent = rentData.length > 0 
      ? rentData.reduce((sum, unit) => sum + unit.rent_amount, 0) / rentData.length 
      : 0;

    return {
      data: {
        totalProperties,
        totalUnits,
        availableUnits,
        averageRent: Math.round(averageRent)
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching property stats:', error);
    return { data: null, error: error.message };
  }
};

/**
 * GET DASHBOARD STATISTICS WITH MORE DETAILS
 * @returns {Object} - { data, error }
 */
export const getDashboardStats = async () => {
      try {
        // Get all data in parallel for better performance
    const [propertiesResult, unitsResult, tenantsResult, leasesResult, recentPropertiesResult] = await Promise.all([
          supabase.from('properties').select('county'),
          supabase.from('units').select('unit_type, is_available, rent_amount'),
      supabase.from('tenants').select('id, name, created_at'),
      supabase.from('leases').select('id, status, rent_amount, start_date, end_date, tenant_id, unit_id'),
          supabase.from('properties').select('id, name, city, county, created_at').order('created_at', { ascending: false }).limit(5)
        ]);

        // Extract data safely
        const properties = propertiesResult.data || [];
        const units = unitsResult.data || [];
    const tenants = tenantsResult.data || [];
    const leases = leasesResult.data || [];
        const recentProperties = recentPropertiesResult.data || [];

    // Calculate basic property and unit statistics
        const totalProperties = properties.length;
        const totalUnits = units.length;
        const availableUnits = units.filter(unit => unit.is_available).length;
        const totalMonthlyRent = units.reduce((sum, unit) => sum + (unit.rent_amount || 0), 0);
        const averageRent = totalUnits > 0 ? totalMonthlyRent / totalUnits : 0;
        const occupiedRent = totalMonthlyRent - (availableUnits * averageRent);

    // Calculate tenant statistics
    const totalTenants = tenants.length;
    const activeTenants = leases.filter(lease => lease.status === 'active')
      .map(lease => lease.tenant_id)
      .filter((id, index, arr) => arr.indexOf(id) === index).length; // Unique active tenants

    // Calculate lease statistics
    const totalLeases = leases.length;
    const activeLeases = leases.filter(lease => lease.status === 'active');
    const totalActiveLeases = activeLeases.length;
    const totalMonthlyRentFromLeases = activeLeases.reduce((sum, lease) => sum + (lease.rent_amount || 0), 0);
    const averageLeaseRent = totalActiveLeases > 0 ? totalMonthlyRentFromLeases / totalActiveLeases : 0;
    const leaseOccupancyRate = totalUnits > 0 ? (totalActiveLeases / totalUnits) * 100 : 0;

        // Calculate properties by county
        const propertiesByCounty = properties.reduce((acc, property) => {
          if (property.county) {
            acc[property.county] = (acc[property.county] || 0) + 1;
          }
          return acc;
        }, {});

        // Calculate units by type
        const unitsByType = units.reduce((acc, unit) => {
          if (!acc[unit.unit_type]) {
            acc[unit.unit_type] = { total: 0, available: 0 };
          }
          acc[unit.unit_type].total += 1;
          if (unit.is_available) {
            acc[unit.unit_type].available += 1;
          }
          return acc;
        }, {});

    // Calculate lease status distribution
    const leaseStatusDistribution = leases.reduce((acc, lease) => {
      acc[lease.status] = (acc[lease.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTenants = tenants.filter(tenant => 
      new Date(tenant.created_at) >= thirtyDaysAgo
    ).length;
    
    const recentLeases = leases.filter(lease => 
      new Date(lease.start_date) >= thirtyDaysAgo
    ).length;

        return {
          data: {
        // Property statistics
            totalProperties,
            totalUnits,
            availableUnits,
            averageRent: Math.round(averageRent),
            propertiesByCounty,
            unitsByType,
            recentProperties,
            totalMonthlyRent: Math.round(totalMonthlyRent),
            occupiedRent: Math.round(occupiedRent),
        occupancyRate: totalUnits > 0 ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100) : 0,
        
        // Tenant statistics
        totalTenants,
        activeTenants,
        recentTenants,
        
        // Lease statistics
        totalLeases,
        totalActiveLeases,
        totalMonthlyRentFromLeases: Math.round(totalMonthlyRentFromLeases),
        averageLeaseRent: Math.round(averageLeaseRent),
        leaseOccupancyRate: Math.round(leaseOccupancyRate),
        leaseStatusDistribution,
        recentLeases,
        
        // Financial insights
        incomeEfficiency: totalMonthlyRent > 0 ? Math.round((totalMonthlyRentFromLeases / totalMonthlyRent) * 100) : 0
        },
        error: null
      };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    // Return safe default values
    return {
      data: {
        // Property statistics
        totalProperties: 0,
        totalUnits: 0,
        availableUnits: 0,
        averageRent: 0,
        propertiesByCounty: {},
        unitsByType: {},
        recentProperties: [],
        totalMonthlyRent: 0,
        occupiedRent: 0,
        occupancyRate: 0,
        
        // Tenant statistics
        totalTenants: 0,
        activeTenants: 0,
        recentTenants: 0,
        
        // Lease statistics
        totalLeases: 0,
        totalActiveLeases: 0,
        totalMonthlyRentFromLeases: 0,
        averageLeaseRent: 0,
        leaseOccupancyRate: 0,
        leaseStatusDistribution: {},
        recentLeases: 0,
        
        // Financial insights
        incomeEfficiency: 0
      },
      error: null
    };
  }
};


/**
 * GET PROPERTIES WITH UNIT COUNT
 * @param {Object} filters - optional filters
 * @returns {Object} - { data, error }
 */
export const getPropertiesWithUnitCount = async (filters = {}) => {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        units (
          id,
          is_available,
          rent_amount
        )
      `)
      .order('created_at', { ascending: false });

    // apply filters if provided
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters.county) {
      query = query.eq('county', filters.county);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching properties with unit count:', error);
      throw new Error(error.message);
    }

    // Process the data to add unit counts and total rent
    const processedData = (data || []).map(property => {
      const units = property.units || [];
      const totalUnits = units.length;
      const availableUnits = units.filter(unit => unit.is_available).length;
      const totalRent = units.reduce((sum, unit) => sum + (unit.rent_amount || 0), 0);
      const averageRent = totalUnits > 0 ? totalRent / totalUnits : 0;

      return {
        ...property,
        totalUnits,
        availableUnits,
        occupiedUnits: totalUnits - availableUnits,
        totalRent: Math.round(totalRent),
        averageRent: Math.round(averageRent),
        occupancyRate: totalUnits > 0 ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100) : 0
      };
    });

    return { data: processedData, error: null };
  } catch (error) {
    console.error('Error fetching properties with unit count:', error);
    return { data: [], error: error.message };
  }
};  