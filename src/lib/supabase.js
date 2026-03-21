import { createClient } from '@supabase/supabase-js'

// Viteの環境変数は import.meta.env.* でアクセスします
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// もし環境変数が無い場合はエラーを出さずにダミーを返し、あとでUI側で警告を出すようにする
let supabaseClient = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient;
