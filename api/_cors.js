module.exports = function enableCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://frontend-carta.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // Indica que ya respondimos
  }

  return false; // Indica que debe seguir la ejecución del endpoint
};
