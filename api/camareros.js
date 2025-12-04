const db = require("../db");
const cors = require("./_cors");

module.exports = async (req, res) => {
  // CORS middleware
  if (cors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let body = req.body;

  // Vercel: parse body if comes as string
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Body inválido" });
    }
  }

  const { usuario, password } = body;

  try {
    const result = await db.query(
      "SELECT * FROM camareros WHERE usuario = $1 AND password = $2",
      [usuario, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const row = result.rows[0];

    return res.status(200).json({
      ok: true,
      usuario: row.usuario,
      nombre: row.nombre,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
