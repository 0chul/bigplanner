import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://injrbniytgtubemniaps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanJibml5dGd0dWJlbW5pYXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzA3NDcsImV4cCI6MjA4OTIwNjc0N30.h3njZ7cRvJblL_MIZJ5qJRD45zjzsdWpPiV-90tDxmg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data: leads } = await supabase.from('leads').select('id').limit(1);
  if (leads && leads.length > 0) {
    const statuses = ['new', 'contacted', 'qualified', 'lost', 'converted', 'unqualified', 'junk'];
    for (const status of statuses) {
      const { error } = await supabase.from('leads').update({ status }).eq('id', leads[0].id);
      console.log(status, error ? 'failed' : 'success');
    }
  }
}

check();
