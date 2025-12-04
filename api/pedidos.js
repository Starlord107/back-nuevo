const db = require("../db");
const cors = require("./_cors");
const { imprimirTicket } = require("../utils/printer");

module.exports = async (req, res) => {

    if (cors(req, res)) return;

  const method = req.method;

  // ============================
  // POST → Crear un pedido
  // ============================
  if (method === "POST") {
    let body = req.body;

    // En Vercel, el body puede venir como texto:
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: "Body inválido" });
      }
    }

    const { mesa_id, items, total, fecha } = body;

    try {
      const result = await db.query(
        "INSERT INTO pedidos (mesa_id, items, total, fecha) VALUES ($1, $2, $3, $4) RETURNING id",
        [mesa_id, JSON.stringify(items), total, fecha]
      );

      // Imprimir ticket
      imprimirTicket({ mesa_id, items, total });

      return res.json({
        success: true,
        pedido_id: result.rows[0].id
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ============================
  // GET → obtener pedidos por mesa
  // /api/pedidos?mesa_id=3
  // ============================
  if (method === "GET") {
    const mesaId = req.query.mesa_id;

    if (!mesaId) {
      return res.status(400).json({ error: "Se requiere mesa_id" });
    }

    try {
      const result = await db.query(
        "SELECT * FROM pedidos WHERE mesa_id = $1 ORDER BY id ASC",
        [mesaId]
      );

      const pedidos = result.rows.map(p => ({
        pedido_id: p.id,
        mesa_id: p.mesa_id,
        items: p.items,
        total: p.total,
        fecha: p.fecha
      }));

      return res.json(pedidos);

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ============================
  // DELETE → borrar pedidos por mesa
  // /api/pedidos?mesa_id=3
  // ============================
  if (method === "DELETE") {
    const mesaId = req.query.mesa_id;

    if (!mesaId) {
      return res.status(400).json({ error: "Se requiere mesa_id" });
    }

    try {
      await db.query("DELETE FROM pedidos WHERE mesa_id = $1", [mesaId]);
      return res.json({
        success: true,
        message: "Pedidos eliminados"
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===================================
  // Si llega otro método → no permitido
  // ===================================
  return res.status(405).json({ error: "Método no permitido" });
};
