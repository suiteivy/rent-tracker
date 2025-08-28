import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktemrlewjvdesvfbzlen.supabase.co'; 
const supabaseanonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW1ybGV3anZkZXN2ZmJ6bGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NjQ3NTIsImV4cCI6MjA2OTQ0MDc1Mn0.1igWzAy3o-eBPT6cNWhHIXzPt-7XabefBwdleThaX1Y'; 

export const supabase = createClient(supabaseUrl, supabaseanonKey);
