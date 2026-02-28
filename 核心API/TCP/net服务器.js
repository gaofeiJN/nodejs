const net = require("net");

// 创建TCP服务器
const server = net.createServer((socket) => {
  console.log("----- 已建立链接 -----");
//   console.log(socket);
//   socket为net.Socket对象，包含了连接的相关信息和方法，可以通过它来与客户端进行通信
//   console.log(socket.remoteAddress); // 客户端的IP地址
//   console.log(socket.remotePort); // 客户端的端口号
//   console.log(socket.localAddress); // 服务器的IP地址
//   console.log(socket.localPort); // 服务器的端口号

  // 监听数据事件
  socket.on("data", (data) => {
    console.log("----- 接收到数据 -----");
    console.log(data.toString());

    // 发送响应数据回客户端
    const response = Buffer.from("你好，客户端！这是来自服务器的响应。");
    socket.write(response, (err) => {
      if (err) {
        console.log("发送响应数据时发生错误：", err);
      } else {
        console.log("响应数据已发送：", response.toString());
      }
    });
  });

  // 监听错误事件
  socket.on("error", (err) => {
    console.log("----- 发生错误 -----");
    console.log(err);
  });

  // 监听关闭事件
  socket.on("close", () => {
    console.log("----- 连接已关闭 -----");
  });
});

// 监听端口
server.listen(8080, () => {
  console.log("TCP服务器已启动，正在监听8080端口...");
});
