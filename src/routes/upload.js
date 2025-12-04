const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

router.post("/", async (req, res) => {
    try {
        const fileStr = req.body.image;

        const uploaded = await cloudinary.uploader.upload(fileStr, {
            folder: "havana66"
        });

        res.json({ url: uploaded.secure_url });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
