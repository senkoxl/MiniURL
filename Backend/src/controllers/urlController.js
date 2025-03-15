const { createShortUrl, getUrlByShortCode } = require("../models/urlModel");

// Función para acortar una URL
const dns = require("dns"); // Importamos el módulo de Node.js para verificar si el dominio existe

const shortenUrl = async (req, res) => {
    try {
        const { url_original } = req.body; // Extraemos la URL enviada en la petición

        // Función para validar la estructura de la URL
        const isValidUrl = (url) => {
            try {
                const parsedUrl = new URL(url); // Intenta crear un objeto URL con la cadena proporcionada
                return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"; // Verifica que el protocolo sea válido
            } catch (err) {
                return false; // Si lanza un error, significa que la URL no tiene una estructura válida
            }
        };

        // Verifica que la URL sea válida en su estructura antes de continuar
        if (!url_original || !isValidUrl(url_original)) {
            return res.status(400).json({ error: "La URL proporcionada no es válida" }); // Devuelve error 400 si la URL es inválida
        }

        // Extrae el dominio de la URL original
        const hostname = new URL(url_original).hostname;

        // Verifica si el dominio realmente existe en internet
        dns.lookup(hostname, async (err) => {
            if (err) {
                return res.status(400).json({ error: "El dominio de la URL no es válido" }); // Si el dominio no es real, devuelve error 400
            }

            // Si la URL es válida y el dominio existe, se guarda en la base de datos
            const newUrl = await createShortUrl(url_original);

            // Devuelve la URL acortada en la respuesta
            res.json({ shortUrl: `http://localhost:3000/${newUrl.codigo_corto}` });
        });

    } catch (error) {
        console.error("Error al acortar URL:", error); // Muestra el error en consola si ocurre un fallo
        res.status(500).json({ error: "Error interno del servidor" }); // Devuelve un error 500 si ocurre una excepción
    }
};



// Función para redirigir a la URL original
const redirectUrl = async (req, res) => {
    try {
        const { shortCode } = req.params; // Obtener el código corto desde la URL

        const url_original = await getUrlByShortCode(shortCode); // Buscar la URL en la base de datos

        if (!url_original) {
            return res.status(404).json({ error: "URL no encontrada" }); // Si no existe, error 404
        }

        res.redirect(url_original); // Redirigir a la URL original
    } catch (error) {
        console.error("Error al redirigir:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Exportar funciones para usarlas en las rutas
module.exports = { shortenUrl, redirectUrl };
