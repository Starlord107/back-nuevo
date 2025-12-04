const db = require("../db");
const cors=require("./_cors");

module.exports = async (req, res) => {
    if (cors(req, res)) return;

  const method = req.method;

  // ------------------------------------------------------------------
  // GET /api/mesas
  // ------------------------------------------------------------------
  if (method === "GET") {
    try {
      const result = await db.query("SELECT * FROM mesas ORDER BY id ASC");
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ------------------------------------------------------------------
  // PUT /api/mesas?id=3
  // ------------------------------------------------------------------
  if (method === "PUT") {
    const id = req.query.id;

    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: "Body inválido" });
      }
    }

    const { estado } = body;

    try {
      await db.query(
        "UPDATE mesas SET estado = $1 WHERE id = $2",
        [estado, id]
      );

      return res.json({
        success: true,
        message: "Mesa actualizada"
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ------------------------------------------------------------------
  // Método no permitido
  // ------------------------------------------------------------------
  return res.status(405).json({ error: "Método no permitido" });
};
