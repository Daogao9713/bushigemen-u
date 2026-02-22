// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// 推荐用 .env：REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY
// 这里我给你做了兜底：如果 env 没配，就用你写死的值（保证你先跑起来）
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  'https://mcpferrkabvnkwklotlg.supabase.co';

const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  'sb_publishable_tvbd5xXgYHMvLnr8b31OOg_5KwBXJZM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);