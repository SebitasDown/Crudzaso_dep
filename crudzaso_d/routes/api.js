// Importa express (una herramienta para crear servidores)
const express = require('express');

// Crea una "ruta" para organizar mejor el código
const router = express.Router();

// Importa la conexión a la base de datos
const db = require('../db');


// ---------------------------------------------
// MOSTRAR TODAS LAS RESERVAS CON TODOS LOS DATOS
router.get('/reservas', async (req, res) => {
    // Hace una consulta a la base de datos para traer datos de reservas, salas y empleados
    const [rows] = await db.query(`
        SELECT
        s.sala,                  -- Nombre de la sala
        s.capacidad,             -- Cuántas personas caben
        s.responsable_sala,      -- Quién es responsable de la sala
        e.empleado_reserva,      -- Nombre del empleado que reservó
        e.correo,                -- Correo del empleado
        r.fecha_reserva,         -- Fecha de la reserva
        r.hora_inicio,           -- Hora en que empieza la reserva
        r.hora_fin               -- Hora en que termina la reserva
        FROM reservas r
        INNER JOIN salas s ON r.id_sala = s.id_sala           -- Une la tabla reservas con salas
        INNER JOIN empleados e ON r.id_empleado = e.id_empleado  -- Une la tabla reservas con empleados
    `);
    // Envía los resultados como respuesta en formato JSON
    res.json(rows); 
});

// ---------------------------------------------
// BUSCAR RESERVAS POR NOMBRE O CORREO DEL EMPLEADO
router.get('/reservas/empleado', async (req, res) => {
    const { filtro } = req.query; // Recibe el texto a buscar (nombre o correo)
    const [rows] = await db.query(`
        SELECT
        s.sala,                  -- Nombre de la sala
        e.empleado_reserva,      -- Nombre del empleado
        e.correo,                -- Correo del empleado
        r.fecha_reserva,         -- Fecha de la reserva
        r.hora_inicio,           -- Hora inicio
        r.hora_fin               -- Hora fin
        FROM reservas r
        INNER JOIN salas s ON r.id_sala = s.id_sala
        INNER JOIN empleados e ON r.id_empleado = e.id_empleado
        WHERE e.empleado_reserva LIKE ? OR e.correo LIKE ?   -- Busca si el nombre o correo contienen el texto
    `, [`%${filtro}%`, `%${filtro}%`]);  // Inserta el filtro en la consulta
    res.json(rows); // Muestra el resultado
});


// ---------------------------------------------
// BUSCAR RESERVAS POR SALA Y FECHA
router.get('/reservas/sala', async (req, res) => {
    const { sala, fecha } = req.query; // Recibe sala y fecha como filtros
    const [rows] = await db.query(`
        SELECT
        s.sala,
        e.empleado_reserva,
        r.fecha_reserva,
        r.hora_inicio,
        r.hora_fin
        FROM reservas r
        INNER JOIN salas s ON r.id_sala = s.id_sala
        INNER JOIN empleados e ON r.id_empleado = e.id_empleado
        WHERE s.sala = ? AND r.fecha_reserva = ?  -- Busca reservas en esa sala y fecha
    `, [sala, fecha]);
    res.json(rows); // Devuelve las reservas encontradas
});


// ---------------------------------------------
// MOSTRAR EMPLEADOS CON MÁS DE UNA RESERVA
router.get('/empleados/reservas-multiples', async (req, res) => {
    const [rows] = await db.query(`
        SELECT 
        e.empleado_reserva,  -- Nombre del empleado
        e.correo,            -- Correo
        COUNT(*) AS total_reservas  -- Cuenta cuántas reservas tiene
        FROM reservas r
        INNER JOIN empleados e ON r.id_empleado = e.id_empleado
        GROUP BY r.id_empleado           -- Agrupa por empleado
        HAVING total_reservas > 1        -- Solo muestra si tiene más de 1 reserva
    `);
    res.json(rows); // Devuelve la lista de empleados con varias reservas
});


// ---------------------------------------------
// MOSTRAR HORAS OCUPADAS DE UNA SALA EN UNA FECHA
router.get('/sala/disponibilidad', async (req, res) => {
    const { sala, fecha } = req.query; // Recibe sala y fecha
    const [reservadas] = await db.query(`
        SELECT
        r.hora_inicio,
        r.hora_fin
        FROM reservas r
        INNER JOIN salas s ON r.id_sala = s.id_sala
        WHERE s.sala = ? AND r.fecha_reserva = ?  -- Filtra por sala y fecha
    `, [sala, fecha]);
    // Devuelve las horas ocupadas en esa sala y fecha
    res.json({ sala, fecha, ocupadas: reservadas });
});





//===CRUD==//

//Empleados


//CREATE
router.post('/empleados', async (req, res) => {
    const { empleado_reserva, correo } = req.body; 
    await db.query('INSERT INTO empleados (empleado_reserva, correo) VALUES (?, ?)', [empleado_reserva, correo]);
    res.json({ mensaje: 'Empleado creado correctamente' });
});

//READ - Obtener todos los empleados
router.get('/empleados', async (req,res) =>{
    const [rows] = await db.query('SELECT * FROM empleados');
    res.json(rows);
});

//READ BY ID - Obtener empleado por ID específico
router.get('/empleados/:id', async (req,res) =>{
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM empleados WHERE id_empleado = ?', [id]);
    res.json(rows);
});

//UPDATE
router.put('/empleados/:id', async (req, res) => {
    const { id } = req.params;
    const { empleado_reserva, correo } = req.body;
    await db.query('UPDATE empleados SET empleado_reserva = ?, correo = ? WHERE id_empleado = ?', [empleado_reserva, correo, id]);
    res.json({ mensaje: 'Empleado actualizado correctamente' });
});

//DELETE
router.delete('/empleados/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM empleados WHERE id_empleado = ?', [id]);
    res.json({ mensaje: 'Empleado eliminado' });
});

//===CRUD SALAS==//

//CREATE - Crear nueva sala
router.post('/salas', async (req, res) => {
    const { sala, capacidad, responsable_sala } = req.body;
    await db.query('INSERT INTO salas (sala, capacidad, responsable_sala) VALUES (?, ?, ?)', [sala, capacidad, responsable_sala]);
    res.json({ mensaje: 'Sala creada correctamente' });
});

//READ - Obtener todas las salas
router.get('/salas', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM salas');
    res.json(rows);
});

//READ BY ID - Obtener sala por ID específico
router.get('/salas/:id', async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM salas WHERE id_sala = ?', [id]);
    res.json(rows);
});

//UPDATE - Actualizar sala
router.put('/salas/:id', async (req, res) => {
    const { id } = req.params;
    const { sala, capacidad, responsable_sala } = req.body;
    await db.query('UPDATE salas SET sala = ?, capacidad = ?, responsable_sala = ? WHERE id_sala = ?', [sala, capacidad, responsable_sala, id]);
    res.json({ mensaje: 'Sala actualizada correctamente' });
});

//DELETE - Eliminar sala
router.delete('/salas/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM salas WHERE id_sala = ?', [id]);
    res.json({ mensaje: 'Sala eliminada' });
});

//===CRUD RESERVAS==//

//CREATE - Crear nueva reserva
router.post('/reservas', async (req, res) => {
    const { id_sala, id_empleado, fecha_reserva, hora_inicio, hora_fin } = req.body;
    await db.query('INSERT INTO reservas (id_sala, id_empleado, fecha_reserva, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)', 
        [id_sala, id_empleado, fecha_reserva, hora_inicio, hora_fin]);
    res.json({ mensaje: 'Reserva creada correctamente' });
});

//READ - Obtener todas las reservas
router.get('/reservas', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM reservas');
    res.json(rows);
});

//READ BY ID - Obtener reserva por ID específico
router.get('/reservas/:id', async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM reservas WHERE id_reserva = ?', [id]);
    res.json(rows);
});

//UPDATE - Actualizar reserva
router.put('/reservas/:id', async (req, res) => {
    const { id } = req.params;
    const { id_sala, id_empleado, fecha_reserva, hora_inicio, hora_fin } = req.body;
    await db.query('UPDATE reservas SET id_sala = ?, id_empleado = ?, fecha_reserva = ?, hora_inicio = ?, hora_fin = ? WHERE id_reserva = ?', 
        [id_sala, id_empleado, fecha_reserva, hora_inicio, hora_fin, id]);
    res.json({ mensaje: 'Reserva actualizada correctamente' });
});

//DELETE - Eliminar reserva
router.delete('/reservas/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM reservas WHERE id_reserva = ?', [id]);
    res.json({ mensaje: 'Reserva eliminada' });
});

// Exporta las rutas para que se puedan usar en otro archivo
module.exports = router;