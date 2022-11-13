import { createClient } from '@supabase/auth-helpers-sveltekit';
import { env } from '$env/dynamic/public';

const supabaseUrl: string = env.PUBLIC_SUPABASE_URL ? env.PUBLIC_SUPABASE_URL : '';
const supabaseAnonKey: string = env.PUBLIC_SUPABASE_ANON_KEY ? env.PUBLIC_SUPABASE_ANON_KEY : '';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
