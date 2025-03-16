const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, 'secret_key', { expiresIn: '1h' });
        res.json({ success: true, token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = new User({ username, email, password });
        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};