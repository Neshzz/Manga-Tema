const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
    // Registro de usuário
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Verificar se usuário já existe
            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Usuário ou email já existe' 
                });
            }

            // Criar novo usuário
            const user = new User({ username, email, password });
            await user.save();

            // Gerar token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Verificar se usuário existe
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Email ou senha inválidos' 
                });
            }

            // Verificar senha
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Email ou senha inválidos' 
                });
            }

            // Gerar token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Obter perfil do usuário
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
                .select('-password')
                .populate('favorites')
                .populate({
                    path: 'readingHistory.manga',
                    select: 'title cover_path'
                });

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = authController;