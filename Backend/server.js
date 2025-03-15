require("dotenv").config();  // Carga las variables de entorno desde .env
const express = require("express"); // Importa Express para manejar el servidor
const cors = require("cors"); // Importa CORS para permitir peticiones externas
const db = require("./src/config/db");



const app = express(); // Crea una instancia de Express

app.use(express.json()); // Permite que Express procese JSON en las peticiones
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend

const urlRoutes = require("./src/routes/urlroutes"); // Importar rutas

app.use("/", urlRoutes); // Usar las rutas en la app


const port = process.env.PORT || 3000; // Usa el puerto definido en .env o el 3000 por defecto
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
