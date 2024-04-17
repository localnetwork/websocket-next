const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Enable CORS for all origins in Express app
app.use(cors());

// Serve static assets from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

const io = socketIo(server, {
  cors: {
    origin: `http://localhost:3001`,
    methods: ["GET", "POST"],
  },
});
// Define WebSocket connection event
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle WebSocket 'message' event
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    // Broadcast the message to all connected clients
    io.emit("message", msg);
  });

  // Handle WebSocket 'disconnect' event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log(`Server is running on port http://localhost:3000`);
});
