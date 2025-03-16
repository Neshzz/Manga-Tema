const express = require('express');
const app = express();

app.use('/components', express.static('components'));

// Rest of the existing code...

module.exports = app; 