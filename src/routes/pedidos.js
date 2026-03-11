const express = require("express");
const router = express.Router();
const db = require("../db");
const {verificarToken} = require("../middleware/auth");

router.post("/", verificarToken, async (req, res) => {
    const { mesa_id, productos, total } = req.body;

    try {
        const pedido = await db.query(
            "INSERT INTO pedidos(mesa_id, total) VALUES($1,$2) RETURNING id;",
            [mesa_id, total]
        );

        const pedidoId = pedido.rows[0].id;

        for (const prod of productos) {
            await db.query(
                "INSERT INTO pedido_items(pedido_id, producto_id, cantidad) VALUES($1,$2,$3)",
                [pedidoId, prod.id, prod.cantidad]
            );
        }

        res.json({ ok: true, pedidoId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/mesa/:mesaId", verificarToken, async (req, res) => {
    const { mesaId } = req.params;

    try {
        const pedidosResult = await db.query(
            "SELECT * FROM pedidos WHERE mesa_id = $1 ORDER BY id DESC",
            [mesaId]
        );

        const pedidos = [];

        for (const pedido of pedidosResult.rows) {
            const itemsResult = await db.query(
                `
                SELECT 
                    pi.id,
                    pi.cantidad,
                    p.id as producto_id,
                    p.nombre,
                    p.precio,
                    p.imagen,
                    p.subcategoria,
                    p.categoria
                FROM pedido_items pi
                JOIN productos p ON p.id = pi.producto_id
                WHERE pi.pedido_id = $1
                `,
                [pedido.id]
            );

            pedidos.push({
                ...pedido,
                items: itemsResult.rows
            });
        }

        res.json(pedidos);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete("/mesa/:mesaId", verificarToken, async (req, res) => {
    const { mesaId } = req.params;

    try {
        const pedidosResult = await db.query(
            "SELECT id FROM pedidos WHERE mesa_id = $1",
            [mesaId]
        );

        for (const pedido of pedidosResult.rows) {
            await db.query("DELETE FROM pedido_items WHERE pedido_id = $1", [pedido.id]);
        }

        await db.query("DELETE FROM pedidos WHERE mesa_id = $1", [mesaId]);

        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.get("/pendientes-impresion", verificarToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.id AS pedido_id,
        p.mesa_id,
        p.fecha,
        p.total,
        pi.producto_id,
        pi.cantidad,
        pr.nombre,
        pr.precio,
        pr.categoria
      FROM pedidos p
      JOIN pedido_items pi ON pi.pedido_id = p.id
      JOIN productos pr ON pr.id = pi.producto_id
      WHERE p.impreso = FALSE
      ORDER BY p.id ASC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Error obteniendo pedidos pendientes:", error);
    res.status(500).json({ error: "Error obteniendo pedidos pendientes" });
  }
});
router.put("/:id/marcar-impreso", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE pedidos SET impreso = TRUE WHERE id = $1",
      [id]
    );

    res.json({ ok: true });

  } catch (error) {
    console.error("Error marcando pedido como impreso:", error);
    res.status(500).json({ error: "Error actualizando pedido" });
  }
});

module.exports = router;