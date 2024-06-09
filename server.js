const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let data = [12, 5, 6, 7, 10, 9];

setInterval(() => {
  // Generate random data for real-time updates
  data = data.map(d => Math.floor(Math.random() * 20));
  io.emit('data', data);
}, 5000); // Emit data every 5 seconds

server.listen(4000, () => {
  console.log('WebSocket server running on port 4000');
});
