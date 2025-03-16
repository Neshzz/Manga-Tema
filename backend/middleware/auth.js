const jwt = require('jsonwebtoken');

const auth = {
    // Middleware para verificar se o usuário está autenticado
    isAuthenticated: (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Token não fornecido' 
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ 
                success: false, 
                message: 'Token inválido' 
            });
        }
    },

    // Middleware para verificar se o usuário é admin
    isAdmin: (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Acesso não autorizado' 
            });
        }
        next();
    }
};

module.exports = auth;