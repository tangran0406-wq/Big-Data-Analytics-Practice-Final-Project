// api/ppts_debug.js
import { admin } from "./_supabase";

export default async function handler(req, res) {
  try {
    const { data, error } = await admin.from("ppts").select("*").limit(1);
    if (error) {
      return res.status(500).json({
        where: "select ppts",
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }
    return res.status(200).json({ ok: true, sample: data });
  } catch (e) {
    return res.status(500).json({ where: "bootstrap/admin", message: String(e?.message || e) });
  }
}
