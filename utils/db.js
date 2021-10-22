const supabase = require("@supabase/supabase-js");
const db = supabase.createClient(process.env.DB_URL, process.env.DB_KEY);
