const express = require("express");
const router = express.Router();
const { shortenUrl, redirectUrl } = require("../controllers/urlController");

// Ruta para acortar una URL (POST)
router.post("/shorten", shortenUrl);

// Ruta para redirigir a la URL original (GET)
router.get("/:shortCode", redirectUrl);

module.exports = router;
