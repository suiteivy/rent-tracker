import { supabase } from '../supabaseClient.js';

// Tenant operations
export const createTenant = async (tenantData) => {
  try {
    // validate required fields
    const requiredFields = ['name', 'contact', 'email'];
    for (const field of requiredFields) {
      if (!tenantData[field] || !tenantData[field].trim()) {
        throw new Error(`${field} is required`);
      }
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tenantData.email.trim())) {
      throw new Error('Please enter a valid email address');
    }

    // prepare data
    const tenantToInsert = {
      name: tenantData.name.trim(),
      contact: tenantData.contact.trim(),
      email: tenantData.email.trim().toLowerCase(),
      phone_number: tenantData.phoneNumber?.trim() || null,
      id_number: tenantData.idNumber?.trim() || null,
      emergency_contact: tenantData.emergencyContact?.trim() || null,
      emergency_phone: tenantData.emergencyPhone?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: (await supabase.auth.getUser()).data.user?.id || null
    };

    const { data, error } = await supabase
      .from('tenants')
      .insert([tenantToInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating tenant:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating tenant:', error);
    return { data: null, error: error.message };
  }
};

// Get all tenants
export const getTenants = async (filters = {}) => {
  try {
    let query = supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (currentUser) {
      query = query.eq('owner_id', currentUser.id);
    }

    // apply filters if provided
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,contact.ilike.%${filters.search}%`);
    }

    if (filters.hasActiveLease !== undefined) {
      if (filters.hasActiveLease) {
        // Get tenants with active leases
        query = supabase
          .from('tenants')
          .select(`
            *,
            leases!inner (
              id,
              status
            )
          `)
          .eq('leases.status', 'active')
          .order('created_at', { ascending: false });
      } else {
        // Get tenants without active leases
        query = supabase
          .from('tenants')
          .select(`
            *,
            leases (
              id,
              status
            )
          `)
          .not('leases.status', 'eq', 'active')
          .order('created_at', { ascending: false });
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching tenants:', error);
      throw new Error(error.message);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return { data: [], error: error.message };
  }
};

// Get tenant by ID
export const getTenantById = async (tenantId) => {
  try {
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    const currentUser = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .eq('owner_id', currentUser?.id || null)
      .single();

    if (error) {
      console.error('Supabase error fetching tenant:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return { data: null, error: error.message };
  }
};

// Update tenant
export const updateTenant = async (tenantId, updateData) => {
  try {
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    // check fields
    const requiredFields = ['name', 'contact', 'email'];
    for (const field of requiredFields) {
      if (updateData[field] && !updateData[field].trim()) {
        throw new Error(`${field} cannot be empty`);
      }
    }

    // validate email format if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email.trim())) {
        throw new Error('Please enter a valid email address');
      }
    }

    // prepare update data
    const tenantToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // clean data
    if (tenantToUpdate.name) tenantToUpdate.name = tenantToUpdate.name.trim();
    if (tenantToUpdate.contact) tenantToUpdate.contact = tenantToUpdate.contact.trim();
    if (tenantToUpdate.email) tenantToUpdate.email = tenantToUpdate.email.trim().toLowerCase();
    if (tenantToUpdate.phoneNumber) tenantToUpdate.phone_number = tenantToUpdate.phoneNumber.trim();
    if (tenantToUpdate.idNumber) tenantToUpdate.id_number = tenantToUpdate.idNumber.trim();
    if (tenantToUpdate.emergencyContact) tenantToUpdate.emergency_contact = tenantToUpdate.emergencyContact.trim();
    if (tenantToUpdate.emergencyPhone) tenantToUpdate.emergency_phone = tenantToUpdate.emergencyPhone.trim();

    // cleanup
    delete tenantToUpdate.phoneNumber;
    delete tenantToUpdate.idNumber;
    delete tenantToUpdate.emergencyContact;
    delete tenantToUpdate.emergencyPhone;

    const currentUser = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from('tenants')
      .update(tenantToUpdate)
      .eq('id', tenantId)
      .eq('owner_id', currentUser?.id || null)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating tenant:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating tenant:', error);
    return { data: null, error: error.message };
  }
};

// Delete tenant
export const deleteTenant = async (tenantId) => {
  try {
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    // check if tenant has active leases before deleting
    const { data: leases, error: leasesError } = await supabase
      .from('leases')
      .select('id, status')
      .eq('tenant_id', tenantId)
      .eq('status', 'active');

    if (leasesError) {
      console.error('Error checking leases:', leasesError);
      throw new Error('Failed to check if tenant has active leases');
    }

    if (leases && leases.length > 0) {
      throw new Error('Cannot delete tenant that has active leases. Please terminate all active leases first.');
    }

    const currentUser = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', tenantId)
      .eq('owner_id', currentUser?.id || null);

    if (error) {
      console.error('Supabase error deleting tenant:', error);
      throw new Error(error.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return { success: false, error: error.message };
  }
};

// Get tenant with lease history
export const getTenantWithLeases = async (tenantId) => {
  try {
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        leases (
          id,
          rent_amount,
          rent_currency,
          rent_frequency,
          start_date,
          end_date,
          status,
          units (
            id,
            unit_number,
            properties (
              id,
              name,
              address
            )
          )
        )
      `)
      .eq('id', tenantId)
      .single();

    if (error) {
      console.error('Supabase error fetching tenant with leases:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching tenant with leases:', error);
    return { data: null, error: error.message };
  }
};

// Get tenant statistics
export const getTenantStats = async () => {
  try {
    // get total tenants
    const { count: totalTenants, error: tenantsError } = await supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true });

    if (tenantsError) throw tenantsError;

    // get tenants with active leases
    const { count: tenantsWithLeases, error: leasesError } = await supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true })
      .not('id', 'in', (
        select('tenant_id')
        .from('leases')
        .eq('status', 'active')
      ));

    if (leasesError) throw leasesError;

    return {
      data: {
        totalTenants,
        tenantsWithLeases: totalTenants - tenantsWithLeases,
        tenantsWithoutLeases: tenantsWithLeases
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching tenant stats:', error);
    return { data: null, error: error.message };
  }
}; 