import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xncwgzcicbivonmfqlaw.supabase.co';
const supabaseAnonKey = 'sb_publishable_bmRB3ep8ozlon2Lhr960MQ_tYg4ij0g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
