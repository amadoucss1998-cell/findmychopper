#!/usr/bin/env node
/**
 * FindMyChopper — one-time database setup script.
 *
 * Run once from your local machine:
 *   node scripts/setup-db.js
 *
 * You need two things from Supabase Dashboard:
 *   1. DB connection string: Settings → Database → Connection string → URI
 *   2. Service role key:     Settings → API → service_role key
 */

const CONNECTION_STRING = 'postgresql://postgres:[YOUR-DB-PASSWORD]@db.bzgekboxmlybkbnfnjv.supabase.co:5432/postgres';
const SERVICE_ROLE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6a2dla2JveG1seWJia25mbmp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg0MjI5NCwiZXhwIjoyMDk2NDE4Mjk0fQ.pLkny1PMqN-vimQazvLlDvR3NV97lAwydBTCTC-cydc';
const SUPABASE_URL      = 'https://bzgekboxmlybkbnfnjv.supabase.co';

// Admin credentials — change these before running
const ADMIN_EMAIL    = 'admin@findmychopper.com';
const ADMIN_PASSWORD = 'Admin@FindMyChopper1';
const ADMIN_NAME     = 'Super Admin';

// ─────────────────────────────────────────────────────────────────────────────

import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

const sql         = postgres(CONNECTION_STRING, { ssl: 'require' });
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log('Connecting to Supabase…');

  // ── Schema ────────────────────────────────────────────────────────────────
  await sql`
    create table if not exists users (
      id              uuid primary key default gen_random_uuid(),
      email           text unique,
      phone           text,
      phone_verified  boolean default false,
      name            text,
      role            text not null default 'passenger',
      rider_status    text,
      vehicle_type    text,
      vehicle_plate   text,
      vehicle_color   text,
      motorcycle      text,
      plate           text,
      license_photo   text,
      vehicle_photo   text,
      license_number  text,
      national_id     text,
      earnings        numeric default 0,
      total_trips     int     default 0,
      rating          numeric,
      rating_count    int     default 0,
      created_at      timestamptz default now()
    )
  `;
  console.log('✓ users table ready');

  // Add phone_verified column if upgrading from older schema
  await sql`alter table users add column if not exists phone_verified boolean default false`.catch(() => {});

  await sql`
    create table if not exists trips (
      id                uuid primary key default gen_random_uuid(),
      passenger_id      uuid references users(id),
      rider_id          uuid references users(id),
      passenger_name    text,
      rider_name        text,
      passenger_phone   text,
      rider_phone       text,
      rider_motorcycle  text,
      rider_plate       text,
      rider_rating      numeric,
      pickup            text,
      pickup_lat        numeric,
      pickup_lng        numeric,
      destination       text,
      dest_lat          numeric,
      dest_lng          numeric,
      fare              numeric,
      distance          numeric,
      duration          int,
      status            text default 'requested',
      passenger_rating  numeric,
      passenger_comment text,
      accepted_at       timestamptz,
      completed_at      timestamptz,
      cancelled_at      timestamptz,
      created_at        timestamptz default now()
    )
  `;
  console.log('✓ trips table ready');

  await sql`
    create table if not exists otps (
      phone      text primary key,
      code       text not null,
      expires_at timestamptz not null
    )
  `;
  console.log('✓ otps table ready');

  // ── RLS off ───────────────────────────────────────────────────────────────
  await sql`alter table users disable row level security`;
  await sql`alter table trips disable row level security`;
  await sql`alter table otps  disable row level security`;
  console.log('✓ Row level security disabled');

  // ── Real-time ─────────────────────────────────────────────────────────────
  try {
    await sql`alter publication supabase_realtime add table trips`;
    console.log('✓ Real-time enabled on trips');
  } catch (e) {
    if (e.message.includes('already')) console.log('✓ Real-time already enabled');
    else console.warn('  Real-time skipped:', e.message);
  }

  // ── Create admin auth user + profile ─────────────────────────────────────
  const [existingProfile] = await sql`select id from users where role = 'admin' limit 1`;
  if (existingProfile) {
    console.log('✓ Admin profile already exists');
  } else {
    // Create in Supabase Auth (bypasses email confirmation)
    const { data: authData, error: authErr } = await adminClient.auth.admin.createUser({
      email:            ADMIN_EMAIL,
      password:         ADMIN_PASSWORD,
      email_confirm:    true,
    });
    if (authErr) { console.error('Auth user creation failed:', authErr.message); }
    else {
      await sql`
        insert into users (id, email, name, role)
        values (${authData.user.id}, ${ADMIN_EMAIL}, ${ADMIN_NAME}, 'admin')
      `;
      console.log(`✓ Admin account created`);
      console.log(`  Email:    ${ADMIN_EMAIL}`);
      console.log(`  Password: ${ADMIN_PASSWORD}`);
    }
  }

  await sql.end();
  console.log('\nSetup complete! Your Supabase database is ready.');
}

main().catch(err => {
  console.error('\nSetup failed:', err.message);
  process.exit(1);
});
