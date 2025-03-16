const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const token = req.url.split('token=')[1];
    
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      ws.isAuthenticated = true;
    } catch (error) {
      ws.close(1008, 'Autenticação inválida');
    }

    ws.on('message', (message) => {
      if (!ws.isAuthenticated) return;
      // Lógica para processar mensagens
    });
  });

  return wss;
};

module.exports = initWebSocket; 