const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { verificarToken, soloAdmin } = require("../middleware/auth");

// LISTAR CAMAREROS (solo autenticados)
router.get("/", verificarToken, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, nombre, email, rol FROM camareros ORDER BY id"
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { nombre, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM camareros WHERE nombre = $1",
      [nombre]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const usuario = result.rows[0];

    let passwordValida = false;

    // Compatibilidad temporal por si aún tienes passwords en texto plano
    if (usuario.password === password) {
      passwordValida = true;
    } else {
      passwordValida = await bcrypt.compare(password, usuario.password);
    }

    if (!passwordValida) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol || "staff",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol || "staff",
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PERFIL ACTUAL
router.get("/me", verificarToken, async (req, res) => {
  res.json(req.usuario);
});

// CREAR NUEVO CAMARERO (solo admin)
router.post("/crear", verificarToken, soloAdmin, async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    const existe = await db.query(
      "SELECT id FROM camareros WHERE nombre = $1 OR email = $2",
      [nombre, email]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "Ya existe un usuario con ese nombre o email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO camareros (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol`,
      [nombre, email, passwordHash, rol || "staff"]
    );

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;