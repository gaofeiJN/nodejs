import { WebSocketServer } from "ws";

// 创建一个WebSocket服务器
const server = new WebSocketServer({
  host: "127.0.0.1",
  port: 8080,

  // clientTracking指定为true之后，WebSocketServer对象会自动管理已建立的连接
  // server.clients : 所有已建立链接的Set
  clientTracking: true,
});

// 监听服务器事件
server.on("error", (error) => {
  console.log(error);
});

server.on("close", () => {
  console.log("服务器正在关闭");
});

server.on("listening", () => {
  console.log(
    `服务器正在监听${server.address().address}:${server.address().port}`,
  );
});

server.on("connection", (socket) => {
  //
  console.log("--------------------------");
  console.log("目前连接数：", server.clients.size);
  socket.send("欢迎访问WebSocket服务器！");

  // 监听socket的事件
  socket.on("error", (error) => {
    console.log(error);
  });

  socket.on("close", (code, reson) => {
    console.log("--------------------------");
    console.log("连接正在关闭");
    console.log("code ：", code);
    console.log("reason ：", reson.toString());

    console.log("目前连接数：", server.clients.size);
  });

  socket.on("message", (data, isBinary) => {
    console.log("--------------------------\n", "data :", data);
    console.log("data.toString() :", data.toString());
    console.log("isBinary :", isBinary);

    // 原样返回客户端
    socket.send(data);
  });
});
