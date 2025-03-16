const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Manga API',
      version: '1.0.0',
      description: 'API para gerenciamento de mangás'
    },
    servers: [{ url: 'http://localhost:5000/api' }]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}; 