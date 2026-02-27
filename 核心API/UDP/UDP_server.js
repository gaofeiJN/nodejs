// The node:dgram module provides an implementation of UDP datagram sockets.
// The dgram module can be used to create both UDP clients and servers.
// It provides an asynchronous network API for creating datagram sockets,
// which can be used to send and receive messages over the network using the User Datagram Protocol (UDP).

const dgram = require("node:dgram");

// 创建一个 UDP 服务器
const server = dgram.createSocket("udp4");

// 监听服务器的 "message" 事件，当接收到消息时触发
server.on("message", (msg, rinfo) => {
  console.log(`服务器收到来自 ${rinfo.address}:${rinfo.port} 的消息: ${msg}`); // 服务器收到来自 127.0.0.1:50900 的消息: Hello, UDP server!
  console.log("客户端信息:", rinfo); // 客户端信息: { address: '127.0.0.1', family: 'IPv4', port: 50900, size: 18 }

  // 发送响应回客户端
  const response = Buffer.from("Hello from UDP server!");
  server.send(response, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error("发送响应失败:", err);
    } else {
      console.log("响应已发送");
    }
  });
});

// 监听服务器的 "error" 事件，当发生错误时触发
server.on("error", (err) => {
  console.error("服务器发生错误:", err);
});

// 监听服务器的 "listening" 事件，当服务器开始监听时触发
server.on("listening", () => {
  const address = server.address();
  console.log(`服务器正在监听 ${address.address}:${address.port}`); // 服务器正在监听 127.0.0.1:41234
  console.log("服务器信息:", address); // 服务器信息: { address: '127.0.0.1', family: 'IPv4', port: 41234 }
});

// 绑定服务器到指定的端口和地址
const PORT = 41234;
const HOST = "localhost";
server.bind(PORT, HOST);
