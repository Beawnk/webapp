import fetch from 'node-fetch';
import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Use process.env for environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_KEY:', SUPABASE_KEY);

async function pingSupabase() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Users?select=id`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      console.log('Supabase pinged successfully:', new Date());
    } else {
      console.error('Supabase ping failed:', res.status);
    }
  } catch (err) {
    console.error('Error pinging Supabase:', err);
  }
}

// Run every day at 3:00 AM
cron.schedule('0 3 * * *', pingSupabase);

// Run immediately on start
pingSupabase();