import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonkey = process.env.REACT_APP_SUPABASE_ANON_KEY;
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonkey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default createClient(supabaseUrl, supabaseAnonkey);