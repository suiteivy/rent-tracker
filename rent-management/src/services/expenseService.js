
import { supabase } from '../supabaseClient';

// Fetch all expenses
export const getExpenses = async () => {
  const { data, error } = await supabase.from('expenses').select('*');
  return { data, error };
};

// Add a new expense
export const addExpense = async (expense) => {
  const { data, error } = await supabase.from('expenses').insert([expense]);
  return { data, error };
};
