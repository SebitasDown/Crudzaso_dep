// Importa express (sirve para crear el servidor)
const express = require('express');
const cors = require('cors');

// Crea una aplicación de express (el servidor)
const app = express();

// Importa las rutas definidas en el archivo "api.js" (donde están todas las rutas)
const routes = require('./routes/api');

// Configura CORS para permitir peticiones desde Postman
app.use(cors());

// Permite que el servidor entienda datos en formato JSON (para enviar y recibir datos fácilmente)
app.use(express.json());

// Todas las rutas que empiezan con "/api" se manejarán con el archivo de rutas importado
app.use('/api', routes);

// Inicia el servidor en el puerto 3000 y muestra un mensaje cuando esté listo
app.listen(3000, () => {
    console.log("El servidor se ejecuta correctamente en el puerto 3000");
});
