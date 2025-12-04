const db = require("./db");
const cors=require("./_cors");

module.exports = async (req, res) => {
    if (cors(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const sql = `
      SELECT 
        p.id AS producto_id,
        p.nombre,
        p.precio AS precio_base,
        p.categoria,
        p.imagen,
        p.subcategoria,
        p.descripcioninfo,
        f.id AS formato_id,
        f.nombre_formato,
        f.precio AS formato_precio
        
      FROM productos p
      LEFT JOIN formatos f ON p.id = f.producto_id
      ORDER BY p.id, f.id;
    `;

    const result = await db.query(sql);

    const productosMap = {};

    result.rows.forEach(row => {
  // Crear el producto si no existe
  if (!productosMap[row.producto_id]) {
    productosMap[row.producto_id] = {
      id: row.producto_id,
      nombre: row.nombre,
      precio: row.precio_base,
      categoria: row.categoria,
      imagen: row.imagen,
      subcategoria: row.subcategoria,
      descripcioninfo: "",   // inicializamos vacío
      formatos: []
    };
  }

  // Solo asignar descripcioninfo si row tiene un valor real
  if (row.descripcioninfo && productosMap[row.producto_id].descripcioninfo === "") {
    productosMap[row.producto_id].descripcioninfo = row.descripcioninfo;
  }

  // Añadir formato
  if (row.formato_id) {
    productosMap[row.producto_id].formatos.push({
      id: row.formato_id,
      nombre: row.nombre_formato,
      precio: row.formato_precio
    });
  }
});

      
    console.log("Productos MAp:",productosMap)
    return res.json(Object.values(productosMap));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
