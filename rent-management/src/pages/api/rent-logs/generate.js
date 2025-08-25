import { supabase } from '../../../src/supabaseClient.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { month, year, force = false } = req.body;

    // Validate month and year
    if (!month || !year) {
      const now = new Date();
      const targetMonth = month || now.getMonth() + 1;
      const targetYear = year || now.getFullYear();
      
      return await generateRentLogs(targetMonth, targetYear, force, res);
    }

    // Validate month range
    if (month < 1 || month > 12) {
      return res.status(400).json({ error: 'Month must be between 1 and 12' });
    }

    // Validate year
    if (year < 2000 || year > 2100) {
      return res.status(400).json({ error: 'Year must be between 2000 and 2100' });
    }

    await generateRentLogs(month, year, force, res);
  } catch (error) {
    console.error('Error generating rent logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function generateRentLogs(month, year, force, res) {
  try {
    // Use the database function to generate rent logs
    const { data, error } = await supabase
      .rpc('generate_monthly_rent_logs', {
        target_month: month,
        target_year: year
      });

    if (error) {
      console.error('Supabase error generating rent logs:', error);
      return res.status(500).json({ error: error.message });
    }

    const [generatedLogs, skippedLogs, errorLogs] = data[0];

    res.status(200).json({
      success: true,
      message: 'Rent logs generated successfully',
      data: {
        generated: generatedLogs,
        skipped: skippedLogs,
        errors: errorLogs,
        month,
        year
      }
    });
  } catch (error) {
    console.error('Error in generateRentLogs:', error);
    res.status(500).json({ error: 'Failed to generate rent logs' });
  }
}
