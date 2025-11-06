// api/ppts.js
import { admin } from "./_supabase";

const allowCORS = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req, res) {
  try {
    allowCORS(req, res);
    if (req.method === "OPTIONS") return res.status(204).end();

    if (req.method === "GET") {
      const { data, error } = await admin
        .from("ppts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("[/api/ppts][GET] supabase error:", error);
        return res.status(500).json({ error: String(error.message || error) });
      }
      return res.status(200).json({ data: data ?? [] });
    }

    if (req.method === "POST") {
      let body = req.body ?? {};
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch {}
      }
      const { title, file_url, cover_url, course } = body;
      if (!title || !file_url) {
        return res.status(400).json({ error: "title & file_url required" });
      }

      const { data, error } = await admin
        .from("ppts")
        .insert([{ title, file_url, cover_url, course }])
        .select("*")
        .single();

      if (error) {
        console.error("[/api/ppts][POST] supabase error:", error);
        return res.status(500).json({ error: String(error.message || error) });
      }
      return res.status(200).json({ data });
    }

    res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    console.error("[/api/ppts] fatal:", e);
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
