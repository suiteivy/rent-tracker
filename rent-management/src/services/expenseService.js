import { supabase } from '../supabaseClient';


// Fetch all expenses with property info
export const getExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      amount,
      description,
      created_at,
      property_id,
      properties ( id, name )
    `); 
  return { data, error };
};

// Add a new expense
export const addExpense = async ({ amount, description, property_id }) => {
  if (!property_id) {
    return { data: null, error: 'property_id is required' };
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert([
      { amount, description, property_id }
    ])
    .select();

  return { data, error };
};
