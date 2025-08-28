
import { supabase } from '../supabaseClient';

// Fetch all rent logs with filters
export const getRentLogs = async (filters) => {
  let query = supabase.from('rent_logs').select('*, tenants(name), properties(name)');
  const today = new Date().toISOString().split('T')[0];

  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'overdue') {
      query = query.eq('status', 'due').lt('due_date', today);
    } else if (filters.status === 'due') {
        query = query.eq('status', 'due').gte('due_date', today);
    } else {
      query = query.eq('status', filters.status);
    }
  }

  if (filters.search) {
    query = query.or(`tenants.name.ilike.%${filters.search}%,properties.name.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  return { data, error };
};

// Update a rent log
export const updateRentLog = async (logId, updates) => {
  const { data, error } = await supabase.from('rent_logs').update(updates).eq('id', logId);
  return { data, error };
};