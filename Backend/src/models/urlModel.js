const pool = require("../config/db"); // Importa la conexión a PostgreSQL
const crypto = require("crypto"); // Para generar códigos cortos aleatorios

// Función para acortar una URL
const createShortUrl = async (url_original) => {
    try {
        const codigo_corto = crypto.randomBytes(3).toString("hex"); // Genera un código de 6 caracteres
        const query = "INSERT INTO urls (url_original, codigo_corto) VALUES ($1, $2) RETURNING *";
        
        const result = await pool.query(query, [url_original, codigo_corto]); // Ejecuta la consulta
        return result.rows[0]; // Devuelve la URL guardada
    } catch (error) {
        console.error("Error al crear URL corta:", error);
        throw error;
    }
};

// Función para obtener una URL por su código corto
const getUrlByShortCode = async (codigo_corto) => {
    try {
        const query = "SELECT url_original FROM urls WHERE codigo_corto = $1";
        const result = await pool.query(query, [codigo_corto]);

        if (result.rows.length === 0) {
            return null; // Retorna null si no se encuentra
        }

        return result.rows[0].url_original; // Devuelve la URL original
    } catch (error) {
        console.error("Error al buscar URL:", error);
        throw error;
    }
};

// Exportar funciones para usarlas en otros archivos
module.exports = { createShortUrl, getUrlByShortCode };
