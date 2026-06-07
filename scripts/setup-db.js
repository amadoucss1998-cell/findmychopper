#!/usr/bin/env node
/**
 * FindMyChopper — one-time database setup script.
 *
 * Run from your local machine (not needed after first run):
 *   node scripts/setup-db.js
 *
 * Requires your Supabase connection string. Find it in:
 *   Supabase Dashboard → Settings → Database → Connection string → URI
 *
 * Paste it below (replace the placeholder):
 */

const CONNECTION_STRING =
  'postgresql://postgres:[YOUR-DB-PASSWORD]@db.bzgekboxmlybkbnfnjv.supabase.co:5432/postgres';

// ─────────────────────────────────────────────────────────────────────────────

import postgres from 'postgres';

const sql = postgres(CONNECTION_STRING, { ssl: 'require' });

async function main() {
  console.log('Connecting to Supabase PostgreSQL…');

  // ── Schema ──────────────────────────────────────────────────────────────────
  await sql`
    create table if not exists users (
      id            uuid primary key default gen_random_uuid(),
      phone         text unique not null,
      name          text,
      email         text,
      role          text not null default 'passenger',
      rider_status  text,
      vehicle_type  text,
      vehicle_plate text,
      vehicle_color text,
      motorcycle    text,
      plate         text,
      license_photo text,
      vehicle_photo text,
      earnings      numeric default 0,
      total_trips   int     default 0,
      rating        numeric,
      rating_count  int     default 0,
      created_at    timestamptz default now()
    )
  `;
  console.log('✓ users table ready');

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

  // ── Disable RLS so the anon key can read/write ───────────────────────────────
  await sql`alter table users disable row level security`;
  await sql`alter table trips disable row level security`;
  await sql`alter table otps  disable row level security`;
  console.log('✓ Row level security disabled');

  // ── Enable real-time on trips ────────────────────────────────────────────────
  try {
    await sql`alter publication supabase_realtime add table trips`;
    console.log('✓ Real-time enabled on trips');
  } catch (e) {
    if (e.message.includes('already')) console.log('✓ Real-time already enabled on trips');
    else console.warn('  Real-time setup skipped:', e.message);
  }

  // ── Seed admin account ───────────────────────────────────────────────────────
  const [existing] = await sql`select id from users where role = 'admin' limit 1`;
  if (!existing) {
    await sql`
      insert into users (phone, name, email, role)
      values ('+231000000000', 'Super Admin', 'admin@findmychopper.com', 'admin')
    `;
    console.log('✓ Admin account created  (phone: +231000000000)');
  } else {
    console.log('✓ Admin account already exists');
  }

  await sql.end();
  console.log('\nSetup complete! Your Supabase database is ready.');
}

main().catch(err => {
  console.error('\nSetup failed:', err.message);
  process.exit(1);
});
