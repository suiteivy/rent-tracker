import { supabase } from '../supabaseClient';

// Helper: get current user
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('User not authenticated');
  return user;
};

// Fetch all expenses )
export const getExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      amount,
      category,
      description,
      created_at,
      property_id,
      properties ( id, name )
    `);

  return { data, error };
};

// Add a new expense (attach user_id automatically)
export const addExpense = async ({ amount, category, description, property_id }) => {
  if (!property_id) {
    return { data: null, error: 'property_id is required' };
  }

  try {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        { amount, category, description, property_id, user_id: user.id }
      ])
      .select();

    return { data, error };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// Total expenses for current month (RLS auto-filters per user)
export const getTotalExpenses = async () => {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount, created_at");

  if (error) {
    console.error("Error fetching expenses:", error);
    return 0;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = data
    ?.filter((row) => {
      const d = new Date(row.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, row) => sum + row.amount, 0);

  return monthlyExpenses || 0;
};
