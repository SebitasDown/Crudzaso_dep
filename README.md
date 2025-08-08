# API de Gestión de Reservas de Salas

Este proyecto es una API REST construida con Node.js y Express, conectada a una base de datos MySQL. Su propósito es gestionar:

- Reservas de salas
- Empleados que hacen reservas
- Información sobre las salas

## 📁 Estructura del Proyecto

- `db.js`: Configuración de conexión a la base de datos.
- `routes/api.js`: Contiene las rutas y la lógica de los endpoints (CRUD).
- `server.js`: Archivo principal que levanta el servidor.
- `README.md`: Documentación del proyecto.

## 🚀 Requisitos previos

- Tener instalado Node.js y npm.
- Tener MySQL en funcionamiento.
- Crear una base de datos llamada `crudzaso`.
- Crear las siguientes tablas en la base de datos:

### Tabla empleados

- `id_empleado` (INT, PK, AI)
- `empleado_reserva` (VARCHAR)
- `correo` (VARCHAR)

### Tabla salas

- `id_sala` (INT, PK, AI)
- `sala` (VARCHAR)
- `capacidad` (INT)
- `responsable_sala` (VARCHAR)

### Tabla reservas

- `id_reserva` (INT, PK, AI)
- `id_sala` (INT, FK)
- `id_empleados` (INT, FK)
- `fecha_reserva` (DATE)
- `hora_inicio` (TIME)
- `hora_fin` (TIME)

## 🔧 Funcionalidades de la API

### Rutas de reservas

- `GET /api/reservas`: Lista todas las reservas.
- `GET /api/reservas/empleado?filtro=`: Busca reservas por nombre o correo del empleado.
- `GET /api/reservas/sala?sala=&fecha=`: Filtra reservas por sala y fecha.
- `GET /api/sala/disponibilidad?sala=&fecha=`: Muestra las horas ya reservadas de una sala en una fecha.
- `GET /api/empleados/reservas-multiples`: Empleados que tienen más de una reserva.

### CRUD para empleados

- `GET /api/empleados`: Obtener todos los empleados.
- `POST /api/empleados`: Crear un nuevo empleado.
- `PUT /api/empleados/:id`: Actualizar un empleado.
- `DELETE /api/empleados/:id`: Eliminar un empleado.

### CRUD para reservas

- `GET /api/reservas`: Obtener todas las reservas.
- `POST /api/reservas`: Crear una nueva reserva.
- `PUT /api/reservas/:id`: Actualizar una reserva.
- `DELETE /api/reservas/:id`: Eliminar una reserva.

## 📦 Dependencias utilizadas

- express
- mysql2

## 🧑 Autor

Desarrollado por: **[Tu Nombre Aquí]**

Este proyecto fue realizado como ejercicio académico para la gestión de salas y reservas de empleados.
