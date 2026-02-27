// UDP客户端
const dgram = require("node:dgram");

// 创建一个UDP客户端
const client = dgram.createSocket("udp4");

// 链接服务器
client.connect(41234, "localhost", () => {
  console.log("已连接到服务器");

  // 向服务器发送消息
  // 连接后发送消息时，不需要指定目标地址和端口，因为已经建立了连接
  // 发送消息时，直接调用 send 方法即可，参数是要发送的消息内容
  const message = Buffer.from("Hello, UDP server!");
  client.send(message, (err) => {
    if (err) {
      console.error("发送消息失败:", err);
    } else {
      console.log("消息已发送");
    }
  });
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
