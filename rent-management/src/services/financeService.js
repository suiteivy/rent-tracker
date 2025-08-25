import { supabase } from '../supabaseClient.js';

// Finance service: rent roll and KPIs (monthly-only per Sprint 2 scope)

/**
 * Compute start and end date strings (YYYY-MM-DD) for a given month and year.
 */
const getMonthRange = (month, year) => {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  const toDateStr = (d) => d.toISOString().slice(0, 10);
  return { startDate: toDateStr(start), endDate: toDateStr(end) };
};

/**
 * Fetch leases that are active within the given month (overlap),
 * filtered by property or unit if provided. Monthly frequency only.
 * Returns enriched rows with unit, property, and tenant info.
 */
export const getRentRoll = async ({ propertyId = '', unitId = '', month, year }) => {
  try {
    if (!month || !year) {
      throw new Error('Both month and year are required');
    }

    const { startDate, endDate } = getMonthRange(Number(month), Number(year));

    // Base query: leases with joins, monthly frequency only, overlapping month
    let query = supabase
      .from('leases')
      .select(`
        *,
        units (
          id,
          unit_number,
          property_id,
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
      .eq('rent_frequency', 'monthly')
      .lte('start_date', endDate)
      .gte('end_date', startDate)
      .order('created_at', { ascending: false });

    if (unitId) {
      query = query.eq('unit_id', unitId);
    }

    // Filter by property via joined units table. Supabase supports filtering joined foreign tables.
    if (propertyId) {
      query = query.eq('units.property_id', propertyId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data || []).map((lease) => {
      const unit = lease.units || {};
      const property = unit.properties || {};
      const tenant = lease.tenants || {};
      return {
        lease_id: lease.id,
        property_id: property.id || unit.property_id || null,
        property_name: property.name || '',
        unit_id: unit.id || null,
        unit_number: unit.unit_number || '',
        tenant_id: tenant.id || null,
        tenant_name: tenant.name || '',
        rent_amount: lease.rent_amount || 0,
        rent_currency: lease.rent_currency || 'KES',
        due_date: lease.due_date || 1,
        start_date: lease.start_date,
        end_date: lease.end_date,
        status: lease.status || 'active'
      };
    });

    return { data: rows, error: null };
  } catch (err) {
    console.error('Error fetching rent roll:', err);
    return { data: [], error: err.message };
  }
};

/**
 * Compute simple KPIs from rent roll: totals per currency and overall.
 * Received/arrears are placeholders until a payments table exists.
 */
export const getFinanceKpis = async (filters) => {
  try {
    const { data: rentRoll, error } = await getRentRoll(filters);
    if (error) throw new Error(error);

    const totalsByCurrency = rentRoll.reduce((acc, row) => {
      const currency = row.rent_currency || 'KES';
      acc[currency] = (acc[currency] || 0) + (row.rent_amount || 0);
      return acc;
    }, {});

    const totalExpected = Object.values(totalsByCurrency).reduce((s, v) => s + v, 0);

    return {
      data: {
        totalsByCurrency,
        totalExpected,
        totalReceived: 0, // placeholder until payments exist
        totalArrears: totalExpected, // expected - received
        collectionRate: totalExpected > 0 ? 0 : 0
      },
      error: null
    };
  } catch (err) {
    console.error('Error computing finance KPIs:', err);
    return { data: null, error: err.message };
  }
};


