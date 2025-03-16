const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

const securityMiddleware = (app) => {
    // Configurações básicas de segurança
    app.use(helmet());
    app.use(hpp());
    app.use(mongoSanitize());
    app.disable('x-powered-by');

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // limite de 100 requisições por IP
        message: 'Muitas requisições deste IP, tente novamente mais tarde'
    });

    app.use('/api/', limiter);

    // Outras configurações de segurança
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        }
    }));

    // Headers de segurança
    app.use((req, res, next) => {
        res.setHeader(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline'"
        );
        res.setHeader('X-Content-Type-Options', 'nosniff');
        next();
    });
};

module.exports = securityMiddleware; 