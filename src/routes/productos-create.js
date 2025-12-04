const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/", async (req, res) => {
    const { nombre, precio, categoria, imagen, subcategoria, descripcioninfo } = req.body;

    try {
        const sql = `
            INSERT INTO productos(nombre, precio, categoria, imagen, subcategoria, descripcioninfo)
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING *;
        `;

        const result = await db.query(sql, [
            nombre,
            precio,
            categoria,
            imagen,
            subcategoria,
            descripcioninfo
        ]);

        res.json(result.rows[0]);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
