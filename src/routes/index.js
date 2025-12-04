const express = require("express");
const router = express.Router();

router.use("/productos", require("./productos"));
router.use("/productos-create", require("./productos-create"));
router.use("/mesas", require("./mesas"));
router.use("/camareros", require("./camareros"));
router.use("/pedidos", require("./pedidos"));
router.use("/upload", require("./upload"));

module.exports = router;
