import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://usiokkwijzhuwdgtqskx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aO1tn-m6IHcyliF2Tl3zMA_ZTNTKJCC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
