// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcpferrkabvnkwklotlg.supabase.co';
const supabaseAnonKey = 'sb_publishable_tvbd5xXgYHMvLnr8b31OOg_5KwBXJZM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);