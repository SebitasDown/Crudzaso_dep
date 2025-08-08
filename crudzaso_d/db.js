// Importa el paquete mysql2 (permite conectar a bases de datos MySQL)
// Usamos 'promise' para poder usar async/await más fácilmente
const mysql = require('mysql2/promise');

// Crea una "piscina de conexiones" (una forma eficiente de conectarse varias veces a la base de datos)
const pool = mysql.createPool({
    host: 'localhost',      // Dirección del servidor de base de datos (local en este caso)
    user: 'root',           // Usuario de la base de datos (normalmente es 'root' en local)
    password: '1017126138', // Contraseña del usuario de la base de datos
    database: 'crudzaso'    // Nombre de la base de datos a la que nos vamos a conectar
});

// Exporta la conexión para poder usarla en otros archivos (como en tus rutas)
module.exports = pool;
