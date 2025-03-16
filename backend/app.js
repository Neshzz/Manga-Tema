const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const logger = require('./config/logger');
const securityMiddleware = require('./middleware/security');
const cacheMiddleware = require('./middleware/cache');
const bodyParser = require('body-parser');
require('dotenv').config();

// Importar rotas
const mangaRoutes = require('./routes/mangaRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const healthRoutes = require('./routes/healthCheck');

const app = express();

// Middlewares com configurações específicas
app.use(cors({
    origin: ['http://localhost:3000', 'https://seusite.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Aplicar middlewares de segurança
securityMiddleware(app);

// Configurações básicas
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'sua_chave_secreta',
    resave: false,
    saveUninitialized: false
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Cache global para rotas específicas
app.use('/api/manga', cacheMiddleware(300)); // 5 minutos de cache

// Rotas
app.use('/api', routes);
app.use('/api/manga', mangaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', healthRoutes);

// Conexão com MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/manga-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Conectado'))
.catch(err => console.error('Erro MongoDB:', err));

// Rotas básicas
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

// Rotas de teste
app.get('/api/manga', (req, res) => {
    res.json({ message: 'API de mangás funcionando!' });
});

app.post('/api/manga', (req, res) => {
    res.json({ message: 'POST de mangá recebido!', data: req.body });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor' 
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
const HOST = '127.0.0.1';

app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});