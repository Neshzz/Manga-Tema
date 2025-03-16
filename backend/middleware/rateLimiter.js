const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite por IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '::1' // Ignora localhost
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Tentativas de login
  message: { success: false, message: 'Muitas tentativas, tente novamente mais tarde' }
});

module.exports = { apiLimiter, authLimiter }; 