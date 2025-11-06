// api/_supabase.js
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error("[_supabase] Missing env SUPABASE_URL");
}
if (!serviceKey) {
  throw new Error("[_supabase] Missing env SUPABASE_SERVICE_ROLE_KEY");
}

// 后端 admin 客户端（禁止持久化 session）
export const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { "X-Client-Info": "vercel-api" } },
});
