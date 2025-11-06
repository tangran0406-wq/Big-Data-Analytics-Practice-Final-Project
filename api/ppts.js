// api/ppts.js
import { createClient } from "@supabase/supabase-js";

function allowCORS(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function makeAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Missing SUPABASE_URL");
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "vercel-api" } },
  });
}

export default async function handler(req, res) {
  try {
    allowCORS(req, res);
    if (req.method === "OPTIONS") return res.status(204).end();

    const supa = makeAdmin();

    if (req.method === "GET") {
      const { data, error } = await supa
        .from("ppts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data: data ?? [] });
    }

    if (req.method === "POST") {
      let body = req.body ?? {};
      if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }
      const { title, file_url, cover_url, course } = body;
      if (!title || !file_url) {
        return res.status(400).json({ error: "title & file_url required" });
      }
      const { data, error } = await supa
        .from("ppts")
        .insert([{ title, file_url, cover_url, course }])
        .select("*")
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data });
    }

    res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
