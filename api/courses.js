import { admin } from "./_supabase";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { data, error } = await admin.from("courses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json({ data });
    }
    if (req.method === "POST") {
      const body = req.body || {};
      const { title, cover_url, url, teacher, tags } = body;
      if (!title) return res.status(400).json({ error: "title is required" });
      const { data, error } = await admin.from("courses").insert([{ title, cover_url, url, teacher, tags }]).select("*").single();
      if (error) throw error;
      return res.status(200).json({ data });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
