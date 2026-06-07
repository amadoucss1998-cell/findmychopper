import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bzgekboxmlybkbnfnjv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6a2dla2JveG1seWJia25mbmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NDIyOTQsImV4cCI6MjA5NjQxODI5NH0.F4gPW5qF2M8GuPB_1vlL3SB7qXZkiX4H0cPp6cyoQI4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Human-readable network error messages
export function friendlyError(err) {
  const msg = err?.message || String(err);
  if (msg === 'Failed to fetch' || msg.includes('NetworkError') || msg.includes('fetch'))
    return 'Cannot reach the server. Your Supabase project may be paused — go to supabase.com/dashboard and click "Restore project".';
  if (msg === 'Invalid login credentials')
    return 'Incorrect email or password.';
  if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('duplicate'))
    return 'An account with this email already exists. Sign in instead.';
  if (msg.includes('Password should be'))
    return 'Password must be at least 6 characters.';
  if (msg.includes('Unable to validate email'))
    return 'Enter a valid email address.';
  return msg || 'Something went wrong. Please try again.';
}
