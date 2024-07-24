// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Productos',
      version: '1.0.0',
      description: 'Documentación de la API para gestionar productos',
    },
  },
  apis: ['./index.js'], // Archivos donde están definidos los endpoints
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

