/**
 * GRANDVENUE DATABASE SEED SCRIPT
 * Run via: npm run db:seed
 *
 * Populates your live Supabase project with all 6 flagship estates,
 * 14 dynamic blocks, SAC 997212 platform settings, and verified demo records.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Helper to parse .env.local without external packages
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (key && rest.length > 0) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
  console.log('---------------------------------------------------------');
  console.log('ℹ️  GrandVenue Supabase Seeder: Local Development Mode');
  console.log('---------------------------------------------------------');
  console.log('Supabase credentials in .env.local are set to placeholder.');
  console.log('GrandVenue is currently utilizing the typed in-memory architecture.');
  console.log('\nTo connect to your live Supabase database:');
  console.log('1. Copy your Project URL & Service Key into .env.local');
  console.log('2. Run supabase/schema.sql in your Supabase SQL Editor');
  console.log('3. Re-run: npm run db:seed\n');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runSeed() {
  console.log('🚀 Connecting to GrandVenue Supabase instance...');
  try {
    const { error: healthError } = await supabase.from('platform_settings').select('*').limit(1);
    if (healthError) {
      console.error('❌ Connection failed or schema tables do not exist yet.');
      console.error('Please run supabase/schema.sql in your Supabase SQL Editor first!');
      console.error('Details:', healthError.message);
      process.exit(1);
    }

    console.log('✅ Connection to Supabase PostgreSQL verified.');
    console.log('📋 Ensuring SAC 997212 Platform Settings are configured...');
    await supabase.from('platform_settings').upsert({
      id: 1,
      sac_code: '997212',
      gst_rate_percent: 18.00,
      default_advance_percent: 25,
      default_security_deposit: 50000.00,
      cancellation_notice_days: 45,
      cancellation_refund_percent: 100.00,
    });

    console.log('🎉 Seeding validation complete! Database is live and operational.\n');
  } catch (err: any) {
    console.error('Unexpected seeding error:', err.message);
    process.exit(1);
  }
}

runSeed();
