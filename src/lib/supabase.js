import { createClient } from '@supabase/supabase-js';

const URL = 'https://bzgekboxmlybkbnfnjv.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6a2dla2JveG1seWJia25mbmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NDIyOTQsImV4cCI6MjA5NjQxODI5NH0.F4gPW5qF2M8GuPB_1vlL3SB7qXZkiX4H0cPp6cyoQI4';

export const supabase = createClient(URL, KEY);
