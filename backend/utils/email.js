const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendPasswordResetEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: 'Suporte Mangá <suporte@manga.com>',
    to,
    subject: 'Redefinição de Senha',
    html: `
      <h2>Redefina sua senha</h2>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>O link expira em 1 hora</p>
    `
  };

  await transporter.sendMail(mailOptions);
}; 