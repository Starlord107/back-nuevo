const db = require("./db");
const cors=require("./_cors");
module.exports = async (req, res) => {
      if (cors(req, res)) return;


  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { nombre, precio, categoria, imagen, subcategoria } = req.body;

    if (!nombre || !precio || !categoria || !imagen) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const sql = `
      INSERT INTO productos (nombre, precio, categoria, imagen, subcategoria)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      nombre,
      precio,
      categoria,
      imagen,
      subcategoria || null
    ];

    const result = await db.query(sql, values);

    res.status(200).json({
      message: "Producto creado correctamente",
      producto: result.rows[0]
    });

  } catch (err) {
    console.error("ERROR INSERTANDO PRODUCTO:", err);
    res.status(500).json({ error: err.message });
  }
};