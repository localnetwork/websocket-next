const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// Create a Next.js app
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare the Next.js app
app.prepare().then(() => {
  // Create an HTTP server
  const httpServer = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Create a WebSocket server
  const io = new Server(httpServer, {
    /* options */
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

  // Start the HTTP server
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
