const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

// Middleware
app.use(bodyParser.json());

// Configurar la conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'jawicho',
  password: 'jawicho123',
  database: 'tienda',
});

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

describe('POST /productos', () => {
    it('debe crear un nuevo producto', async () => {
      const response = await request(app)
        .post('/productos')
        .send({
          nombre: 'Producto Test',
          descripcion: 'Descripción del producto test',
          precio: 9.99,
        });
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nombre).toBe('Producto Test');
      expect(response.body.descripcion).toBe('Descripción del producto test');
      expect(response.body.precio).toBe(9.99);
    });
  
    it('debe manejar errores al crear un producto', async () => {
      const response = await request(app)
        .post('/productos')
        .send({
          nombre: '', // Nombre vacío para provocar error
          descripcion: '',
          precio: -10, // Precio negativo para provocar error
        });
  
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  afterAll(() => {
    pool.end(); // Cierra el pool de conexiones al final de las pruebas
  });
  