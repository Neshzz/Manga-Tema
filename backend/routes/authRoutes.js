const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');
const authMiddleware = require('../middlewares/authMiddleware');
const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/emailUtils');
const { body, validationResult } = require('express-validator');

router.post('/register', [
    body('username').notEmpty().withMessage('Nome de usuário é obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) return res.status(200).json({ success: true });

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  // Enviar email
  const resetUrl = `https://seusite.com/reset-password/${token}`;
  await sendPasswordResetEmail(email, resetUrl);
  
  res.json({ success: true });
});

router.post('/reset-password/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ success: false, message: 'Token inválido ou expirado' });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true });
});

module.exports = router;