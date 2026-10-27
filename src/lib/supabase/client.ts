import { RPCH_SUPABASE_URL, RPCH_SUPABASE_ANON_KEY } from '@/lib/supabase-rpch';
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    RPCH_SUPABASE_URL,
    RPCH_SUPABASE_ANON_KEY
  );
}
