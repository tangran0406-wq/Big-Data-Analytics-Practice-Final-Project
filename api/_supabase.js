// api/_supabase.js
import { createClient } from "@supabase/supabase-js";

let _admin = null;

export function getAdmin() {
  if (_admin) return _admin;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("[_supabase] Missing SUPABASE_URL");
  if (!key) throw new Error("[_supabase] Missing SUPABASE_SERVICE_ROLE_KEY");

  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "vercel-api" } },
  });
  return _admin;
}
