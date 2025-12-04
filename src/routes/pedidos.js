const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/", async (req, res) => {
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

module.exports = router;
