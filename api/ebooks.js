import { admin } from "./_supabase";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { data, error } = await admin.from("ebooks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json({ data });
    }
    if (req.method === "POST") {
      const body = req.body || {};
      const { title, file_url, cover_url, author } = body;
      if (!title || !file_url) return res.status(400).json({ error: "title & file_url required" });
      const { data, error } = await admin.from("ebooks").insert([{ title, file_url, cover_url, author }]).select("*").single();
      if (error) throw error;
      return res.status(200).json({ data });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
