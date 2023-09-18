// Serwer (server.js)
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let globalCounter = 0;

wss.on('connection', (ws) => {
  // Wysyłamy aktualną wartość licznika do nowo połączonego klienta
  ws.send(JSON.stringify({ counter: globalCounter }));

  ws.on('message', (message) => {
    // Odbieramy komunikat od klienta
    const data = JSON.parse(message);
    if (data.action === 'increment') {
      // Zwiększamy licznik
      globalCounter += 0.001;
      globalCounter = parseFloat(globalCounter.toFixed(3));
      // Rozsyłamy aktualizację do wszystkich połączonych klientów
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ counter: globalCounter }));
        }
      });
    }
  });
});

// Serwowanie plików HTML i klienta
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
