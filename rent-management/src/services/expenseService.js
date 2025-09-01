import { supabase } from '../supabaseClient';


// Fetch all expenses with property info
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

// Add a new expense
export const addExpense = async ({ amount, category,description, property_id }) => {
  if (!property_id) {
    return { data: null, error: 'property_id is required' };
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert([
      { amount, category,description, property_id }
    ])
    .select();

  return { data, error };
};

//total expenses
export const getTotalExpenses = async () => {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount, created_at");

  if (error) {
    console.error("Error fetching expenses:", error);
    return 0;
  }

  // Filter by current month
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

