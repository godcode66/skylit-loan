export default async function handler(req, res) {
  // Ambil URL dari Environment Variable Vercel, atau gunakan URL yang ditempel di sini
  const GAS_URL = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbz1AOcRP83LqQQG1u8R19piC2F6C92H1XY6KV3ID1Hw9iKr7Mq2daMzgur4KUvYKLzJ/exec";

  try {
    // 1. Jika browser meminta data awal (GET)
    if (req.method === "GET") {
      const response = await fetch(`${GAS_URL}?action=init&t=${Date.now()}`, {
        cache: "no-store"
      });
      const data = await response.json();
      res.setHeader("Cache-Control", "no-store, max-age=0");
      return res.status(200).json(data);
    }

    // 2. Jika browser mengirim form peminjaman (POST)
    if (req.method === "POST") {
      const bodyData = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: bodyData
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ sukses: false, pesan: "Metode tidak diizinkan" });
  } catch (error) {
    return res.status(500).json({
      sukses: false,
      pesan: "Gagal menghubungi server database perpustakaan."
    });
  }
}