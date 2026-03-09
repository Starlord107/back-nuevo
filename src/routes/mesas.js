const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM mesas ORDER BY id");
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put("/:id/estado", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const result = await db.query(
            "UPDATE mesas SET estado = $1 WHERE id = $2 RETURNING *",
            [estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Mesa no encontrada" });
        }

        res.json(result.rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;