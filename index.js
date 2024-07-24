const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = 3000;

// Configurar la conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'jawicho',
  password: 'jawicho123',
  database: 'tienda',
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         descripcion:
 *           type: string
 *           description: Descripción del producto
 *         precio:
 *           type: number
 *           description: Precio del producto
 *       required:
 *         - nombre
 *         - descripcion
 *         - precio
 */

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos inválidos para crear el producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error al crear el producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


// Endpoint para crear un nuevo producto (Create)
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body;
  
    // Validación de datos
    if (!nombre || !descripcion || typeof precio !== 'number' || precio <= 0) {
      return res.status(400).json({ error: 'Datos inválidos para crear el producto' });
    }
  
    const sql = 'INSERT INTO productos (nombre, descripcion, precio) VALUES (?, ?, ?)';
    pool.query(sql, [nombre, descripcion, precio], (error, results) => {
      if (error) {
        console.error('Error al crear el producto:', error);
        return res.status(500).json({ error: 'Error al crear el producto' });
      }
      const newProduct = { id: results.insertId, nombre, descripcion, precio, fecha_creacion: new Date() };
      res.status(201).json(newProduct);
    });
  });

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Documentación de la API disponible en http://localhost:${port}/api-docs`);
});
