const http = require("http");
const { Server } = require("socket.io");

// Create an HTTP server
const server = http.createServer((req, res) => {
  console.log("Socket.IO server is running server.js");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.IO server is running server.js");
});

// Initialize Socket.IO
const io = new Server(server);

// Define WebSocket connection event
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle WebSocket events here
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    // Broadcast the message to all connected clients
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(3001, () => {
  console.log("Socket.IO server listening on *:3001");
});
