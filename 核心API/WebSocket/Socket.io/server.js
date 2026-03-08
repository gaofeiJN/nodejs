const app = require("express")();
const { Socket } = require("node:dgram");
const { createServer } = require("node:http");
const path = require("path");
const { Server } = require("socket.io");

const server = createServer(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(8080, "localhost", () => {
  console.log("server running at http://localhost:8080");
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`新的用户创建了连接，目前用户数：${io.of("/").sockets.size}`);

  // 监听事件
  socket.on("disconnect", () => {
    console.log("用户离开了");
    console.log(`新的用户创建了连接，目前用户数：${io.of("/").sockets.size}`);
  });

  socket.on("error", (error) => {
    console.log(error);
  });

  socket.on("chat message", (message) => {
    io.emit("chat message", message);
  });
});
