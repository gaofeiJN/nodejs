const net = require("net");

// 创建TCP客户端
// connection为net.Socket对象，包含了连接的相关信息和方法，可以通过它来与服务器进行通信
const connection = net.createConnection({ port: 8080 }, () => {
  console.log("已连接到服务器");
});

// 发送数据到服务器
const message = Buffer.from("你好，服务器！这是来自客户端的消息。");
connection.write(message, (err) => {
  if (err) {
    console.log("发送数据时发生错误：", err);
  } else {
    console.log("数据已发送：", message.toString());
  }
});

// 监听数据事件
connection.on("data", (data) => {
    console.log("----- 接收到数据 -----");
    console.log(data.toString());
    // 关闭连接
    // 此为半关闭连接，服务器会收到一个FIN包，但客户端仍然可以接收数据，直到服务器关闭连接
    connection.end();
});

// 监听错误事件
connection.on("error", (err) => {
  console.log("----- 发生错误 -----");
  console.log(err);
});

// 监听关闭事件
connection.on("close", () => {
  console.log("----- 连接已关闭 -----");
});