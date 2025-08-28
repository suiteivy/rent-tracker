import { supabase } from '../supabaseClient.js';

// Lease operations
export const createLease = async (leaseData) => {
  try {
    // check required fields
    const requiredFields = ['unitId', 'tenantId', 'rentAmount', 'startDate', 'endDate'];
    for (const field of requiredFields) {
      if (!leaseData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // validate rent amount
    if (leaseData.rentAmount <= 0) {
      throw new Error('Rent amount must be greater than 0');
    }

    // validate dates
    const startDate = new Date(leaseData.startDate);
    const endDate = new Date(leaseData.endDate);
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    // check if unit is available (no active leases)
    const { data: existingLeases, error: checkError } = await supabase
      .from('leases')
      .select('id')
      .eq('unit_id', leaseData.unitId)
      .eq('status', 'active');

    if (checkError) {
      console.error('Error checking unit availability:', checkError);
      throw new Error('Failed to check unit availability');
    }

    if (existingLeases && existingLeases.length > 0) {
      throw new Error('Unit already has an active lease. Please terminate the existing lease first.');
    }

    // prepare data
    const leaseToInsert = {
      unit_id: leaseData.unitId,
      tenant_id: leaseData.tenantId,
      rent_amount: leaseData.rentAmount,
      rent_currency: leaseData.rentCurrency || 'KES',
      rent_frequency: leaseData.rentFrequency || 'monthly',
      due_date: leaseData.dueDate || 1,
      start_date: leaseData.startDate,
      end_date: leaseData.endDate,
      deposit_amount: leaseData.depositAmount || null,
      deposit_currency: leaseData.depositCurrency || 'KES',
      status: leaseData.status || 'active',
      notes: leaseData.notes?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: (await supabase.auth.getUser()).data.user?.id || null
    };

    const { data, error } = await supabase
      .from('leases')
      .insert([leaseToInsert])
      .select(`
        *,
        units (
          id,
          unit_number,
          properties (
            id,
            name,
            address
          )
        ),
        tenants (
          id,
          name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Supabase error creating lease:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating lease:', error);
    return { data: null, error: error.message };
  }
};

// Get all leases
export const getLeases = async (filters = {}) => {
  try {
    let query = supabase
      .from('leases')
      .select(`
        *,
        units (
          id,
          unit_number,
          properties (
            id,
            name,
            address
          )
        ),
        tenants (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (currentUser) {
      query = query.eq('owner_id', currentUser.id);
    }

    // apply filters if provided
    if (filters.unitId) {
      query = query.eq('unit_id', filters.unitId);
    }

    if (filters.tenantId) {
      query = query.eq('tenant_id', filters.tenantId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.propertyId) {
      query = query.eq('units.properties.id', filters.propertyId);
    }

    if (filters.search) {
      query = query.or(`tenants.name.ilike.%${filters.search}%,units.unit_number.ilike.%${filters.search}%`);
    }

    // date range filters
    if (filters.startDateFrom) {
      query = query.gte('start_date', filters.startDateFrom);
    }

    if (filters.startDateTo) {
      query = query.lte('start_date', filters.startDateTo);
    }

    if (filters.endDateFrom) {
      query = query.gte('end_date', filters.endDateFrom);
    }

    if (filters.endDateTo) {
      query = query.lte('end_date', filters.endDateTo);
    }

    // rent amount filters
    if (filters.minRent) {
      query = query.gte('rent_amount', filters.minRent);
    }

    if (filters.maxRent) {
      query = query.lte('rent_amount', filters.maxRent);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching leases:', error);
      throw new Error(error.message);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching leases:', error);
    return { data: [], error: error.message };
  }
};

// Get lease by ID
export const getLeaseById = async (leaseId) => {
  try {
    if (!leaseId) {
      throw new Error('Lease ID is required');
    }

    let query = supabase
      .from('leases')
      .select(`
        *,
        units (
          id,
          unit_number,
          properties (
            id,
            name,
            address
          )
        ),
        tenants (
          id,
          name,
          email,
          contact,
          phone_number
        )
      `)
      .eq('id', leaseId);
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (currentUser) {
      query = query.eq('owner_id', currentUser.id);
    }
    const { data, error } = await query.single();

    if (error) {
      console.error('Supabase error fetching lease:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching lease:', error);
    return { data: null, error: error.message };
  }
};

// Update lease
export const updateLease = async (leaseId, updateData) => {
  try {
    if (!leaseId) {
      throw new Error('Lease ID is required');
    }

    // validate rent amount if provided
    if (updateData.rentAmount !== undefined && updateData.rentAmount <= 0) {
      throw new Error('Rent amount must be greater than 0');
    }

    // validate dates if provided
    if (updateData.startDate && updateData.endDate) {
      const startDate = new Date(updateData.startDate);
      const endDate = new Date(updateData.endDate);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
    }

    // prepare update data
    const leaseToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // clean data
    if (leaseToUpdate.unitId) leaseToUpdate.unit_id = leaseToUpdate.unitId;
    if (leaseToUpdate.tenantId) leaseToUpdate.tenant_id = leaseToUpdate.tenantId;
    if (leaseToUpdate.rentFrequency) leaseToUpdate.rent_frequency = leaseToUpdate.rentFrequency;
    if (leaseToUpdate.dueDate) leaseToUpdate.due_date = leaseToUpdate.dueDate;
    if (leaseToUpdate.startDate) leaseToUpdate.start_date = leaseToUpdate.startDate;
    if (leaseToUpdate.endDate) leaseToUpdate.end_date = leaseToUpdate.endDate;
    if (leaseToUpdate.depositAmount) leaseToUpdate.deposit_amount = leaseToUpdate.depositAmount;
    if (leaseToUpdate.depositCurrency) leaseToUpdate.deposit_currency = leaseToUpdate.depositCurrency;
    if (leaseToUpdate.rentCurrency) leaseToUpdate.rent_currency = leaseToUpdate.rentCurrency;
    if (leaseToUpdate.notes) leaseToUpdate.notes = leaseToUpdate.notes.trim();

    // cleanup
    delete leaseToUpdate.unitId;
    delete leaseToUpdate.tenantId;
    delete leaseToUpdate.rentFrequency;
    delete leaseToUpdate.dueDate;
    delete leaseToUpdate.startDate;
    delete leaseToUpdate.endDate;
    delete leaseToUpdate.depositAmount;
    delete leaseToUpdate.depositCurrency;
    delete leaseToUpdate.rentCurrency;

    const currentUser = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from('leases')
      .update(leaseToUpdate)
      .eq('id', leaseId)
      .eq('owner_id', currentUser?.id || null)
      .select(`
        *,
        units (
          id,
          unit_number,
          properties (
            id,
            name,
            address
          )
        ),
        tenants (
          id,
          name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Supabase error updating lease:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating lease:', error);
    return { data: null, error: error.message };
  }
};

// Delete lease
export const deleteLease = async (leaseId) => {
  try {
    if (!leaseId) {
      throw new Error('Lease ID is required');
    }

    const { error } = await supabase
      .from('leases')
      .delete()
      .eq('id', leaseId);

    if (error) {
      console.error('Supabase error deleting lease:', error);
      throw new Error(error.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting lease:', error);
    return { success: false, error: error.message };
  }
};

// Get leases by unit
export const getLeasesByUnit = async (unitId) => {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    const { data, error } = await supabase
      .from('leases')
      .select(`
        *,
        tenants (
          id,
          name,
          email
        )
      `)
      .eq('unit_id', unitId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Supabase error fetching leases by unit:', error);
      throw new Error(error.message);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching leases by unit:', error);
    return { data: [], error: error.message };
  }
};

// Get leases by tenant
export const getLeasesByTenant = async (tenantId) => {
  try {
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    const { data, error } = await supabase
      .from('leases')
      .select(`
        *,
        units (
          id,
          unit_number,
          properties (
            id,
            name,
            address
          )
        )
      `)
      .eq('tenant_id', tenantId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Supabase error fetching leases by tenant:', error);
      throw new Error(error.message);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching leases by tenant:', error);
    return { data: [], error: error.message };
  }
};

// Get lease statistics
export const getLeaseStats = async () => {
  try {
    // get total leases
    const { count: totalLeases, error: leasesError } = await supabase
      .from('leases')
      .select('*', { count: 'exact', head: true });

    if (leasesError) throw leasesError;

    // get active leases
    const { count: activeLeases, error: activeError } = await supabase
      .from('leases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (activeError) throw activeError;

    // get expired leases
    const { count: expiredLeases, error: expiredError } = await supabase
      .from('leases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'expired');

    if (expiredError) throw expiredError;

    // get total monthly rent from active leases
    const { data: rentData, error: rentError } = await supabase
      .from('leases')
      .select('rent_amount')
      .eq('status', 'active');

    if (rentError) throw rentError;

    const totalMonthlyRent = rentData.reduce((sum, lease) => sum + (lease.rent_amount || 0), 0);
    const averageRent = activeLeases > 0 ? totalMonthlyRent / activeLeases : 0;

    return {
      data: {
        totalLeases,
        activeLeases,
        expiredLeases,
        totalMonthlyRent: Math.round(totalMonthlyRent),
        averageRent: Math.round(averageRent)
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching lease stats:', error);
    return { data: null, error: error.message };
  }
}; 

// Renew lease by extending end date or creating a fresh record
// Strategy: default is to extend the existing lease's end_date by a number of months
// Options:
// - months: number of months to extend (default 12)
// - newRentAmount: optional updated rent
// - createNew: if true, mark current lease as 'expired' and create a new active lease
export const renewLease = async (leaseId, options = {}) => {
  const {
    months = 12,
    newRentAmount,
    createNew = false
  } = options;

  try {
    if (!leaseId) throw new Error('Lease ID is required');

    // Load existing lease
    const currentUser = (await supabase.auth.getUser()).data.user;
    const { data: existing, error: loadError } = await supabase
      .from('leases')
      .select('*')
      .eq('id', leaseId)
      .eq('owner_id', currentUser?.id || null)
      .single();

    if (loadError) throw new Error(loadError.message);
    if (!existing) throw new Error('Lease not found');

    // Compute new end date by adding months to current end_date (or today if missing)
    const baseDate = existing.end_date ? new Date(existing.end_date) : new Date();
    const newEnd = new Date(baseDate);
    newEnd.setMonth(newEnd.getMonth() + months);

    if (!createNew) {
      // Extend the same lease
      const updatePayload = {
        end_date: newEnd.toISOString(),
        status: 'active',
        updated_at: new Date().toISOString()
      };
      if (newRentAmount !== undefined) {
        if (newRentAmount <= 0) throw new Error('New rent must be greater than 0');
        updatePayload.rent_amount = newRentAmount;
      }

      const { data, error } = await supabase
        .from('leases')
        .update(updatePayload)
        .eq('id', leaseId)
        .eq('owner_id', currentUser?.id || null)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return { data, error: null };
    }

    // Otherwise, close current lease and create a new one
    const { error: closeError } = await supabase
      .from('leases')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('id', leaseId)
      .eq('owner_id', currentUser?.id || null);

    if (closeError) throw new Error(closeError.message);

    const insertPayload = {
      unit_id: existing.unit_id,
      tenant_id: existing.tenant_id,
      rent_amount: newRentAmount !== undefined ? newRentAmount : existing.rent_amount,
      rent_currency: existing.rent_currency,
      rent_frequency: existing.rent_frequency,
      due_date: existing.due_date,
      start_date: existing.end_date || new Date().toISOString(),
      end_date: newEnd.toISOString(),
      deposit_amount: existing.deposit_amount,
      deposit_currency: existing.deposit_currency,
      status: 'active',
      notes: existing.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: currentUser?.id || null
    };

    const { data: newLease, error: createError } = await supabase
      .from('leases')
      .insert([insertPayload])
      .select('*')
      .single();

    if (createError) throw new Error(createError.message);
    return { data: newLease, error: null };
  } catch (error) {
    console.error('Error renewing lease:', error);
    return { data: null, error: error.message };
  }
};