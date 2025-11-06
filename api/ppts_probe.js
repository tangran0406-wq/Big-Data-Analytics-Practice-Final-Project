// api/ppts_probe.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return res.status(500).json({ stage: "env", has_url: !!url, has_key: !!key });
    }

    const supa = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "X-Client-Info": "vercel-probe" } },
    });

    const { data, error } = await supa.from("ppts").select("*").limit(1);
    if (error) {
      return res.status(500).json({
        stage: "query",
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }
    return res.status(200).json({ ok: true, sample: data });
  } catch (e) {
    return res.status(500).json({ stage: "init", message: String(e?.message || e) });
  }
}
