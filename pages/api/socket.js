import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server;
    const io = new Server(httpServer, {
      /* options */
    });
    httpServer.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("message", (message) => {
        console.log("message: " + message);
        io.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
  console.log("socket.io server is running api");
  res.end();
}
