// UDP客户端
const dgram = require("node:dgram");

// 创建一个UDP客户端
const client = dgram.createSocket("udp4");

// 向服务器发送消息
const message = Buffer.from("Hello, UDP server!");
const port = 41234;
const address = "localhost";
client.send(message, port, address, (err) => {
  if (err) {
    console.error("发送消息失败:", err);
  } else {
    console.log("消息已发送");
  }
});

// 监听客户端的 "message" 事件，当接收到服务器的响应时触发
client.on("message", (msg, rinfo) => {
  console.log(`客户端收到服务器响应: ${msg}`); // 客户端收到服务器响应: Hello from UDP server!
  console.log("服务器信息:", rinfo); // 服务器信息: { address: '127.0.0.1', family: 'IPv4', port: 41234, size: 22 }

  // 关闭客户端
  client.close();
});

// 监听客户端的 "error" 事件，当发生错误时触发
client.on("error", (err) => {
  console.error("客户端发生错误:", err);
  client.close();
});
