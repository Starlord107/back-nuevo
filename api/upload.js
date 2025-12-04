const cors = require("./_cors");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  // -----------------------------
  //        CORS MIDDLEWARE
  // -----------------------------
  if (cors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const chunks = [];

    // Leer el archivo enviado (binary stream)
    req.on("data", (chunk) => chunks.push(chunk));

    req.on("end", async () => {
      const buffer = Buffer.concat(chunks);

      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: "restaurante_productos",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });

        return res.status(200).json({ url: result.secure_url });

      } catch (error) {
        console.error("Cloudinary error:", error);
        return res.status(500).json({ error: "Error subiendo imagen" });
      }
    });
  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ error: "Error procesando la imagen" });
  }
};
