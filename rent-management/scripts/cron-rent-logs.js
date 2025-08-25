// Cron job script for automatic rent log generation
// This script can be run via node-cron or scheduled via a hosting platform

import { supabase } from '../src/supabaseClient.js';

async function generateMonthlyRentLogs() {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = now.getFullYear();
    
    console.log(`Starting rent log generation for ${currentMonth}/${currentYear}`);
    
    // Use the database function to generate rent logs
    const { data, error } = await supabase
      .rpc('generate_monthly_rent_logs', {
        target_month: currentMonth,
        target_year: currentYear
      });

    if (error) {
      console.error('Error generating rent logs:', error);
      return { success: false, error: error.message };
    }

    const [generatedLogs, skippedLogs, errorLogs] = data[0];
    
    console.log(`Rent logs generated successfully:
      - Generated: ${generatedLogs}
      - Skipped: ${skippedLogs}
      - Errors: ${errorLogs}`);
    
    return {
      success: true,
      data: {
        generated: generatedLogs,
        skipped: skippedLogs,
        errors: errorLogs,
        month: currentMonth,
        year: currentYear
      }
    };
  } catch (error) {
    console.error('Error in cron job:', error);
    return { success: false, error: error.message };
  }
}

// If running as a standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMonthlyRentLogs()
    .then(result => {
      if (result.success) {
        console.log('Cron job completed successfully');
        process.exit(0);
      } else {
        console.error('Cron job failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Cron job error:', error);
      process.exit(1);
    });
}

export { generateMonthlyRentLogs };
