const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM camareros ORDER BY id");
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post("/login", async (req, res) => {
    const { nombre, password } = req.body;

    try {
        const result = await db.query(
            "SELECT id, nombre FROM camareros WHERE nombre = $1 AND password = $2",
            [nombre, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        res.json({
            token: "token-demo",
            usuario: result.rows[0]
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
