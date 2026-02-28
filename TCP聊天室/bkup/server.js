const net = require("net");
const msgTypes = require("./msgTypes");
const { type } = require("os");

// net模块没有内置的connection集合，需要自己创建一个数组来管理所有连接的客户端
const clientList = [];

// 创建TCP服务器
const server = net.createServer();

// 监听客户端连接事件
server.on("connection", (client) => {
  console.log("新的客户端连接:", client.remoteAddress, client.remotePort);

  // 要求新连接的客户端输入昵称
  client.write(
    JSON.stringify({
      type: msgTypes.login,
      success: false,
      content: "【系统】欢迎来到聊天室！请输入你的昵称：",
      userCount: 0,
    }),
  );

  // 监听数据事件
  client.on("data", (data) => {
    const message = JSON.parse(data.toString().trim());
    console.log("收到客户端的消息 ：", message);

    // 如果客户端还没有设置昵称，第一条消息就是昵称
    if (!client.nickname) {
      // 检查昵称是否已被占用
      if (clientList.find((c) => c.nickname === message.nickname)) {
        client.write(
          JSON.stringify({
            type: msgTypes.login,
            success: false,
            content: "【系统】该昵称已被占用，请重新输入！",
            userCount: 0,
          }),
        );
        return;
      }

      // 设置客户端昵称并添加到客户端列表
      client.nickname = message.nickname;
      clientList.push(client);
      console.log(
        `客户端 ${client.remoteAddress}:${client.remotePort} 设置了昵称: ${client.nickname}`,
      );

      // 发送欢迎消息给客户端
      client.write(
        JSON.stringify({
          type: msgTypes.login,
          success: true,
          nickname: client.nickname,
          content: "【系统】昵称设置成功！现在你可以开始聊天了！",
          userCount: clientList.length,
        }),
      );

      // 广播新用户加入的消息给其他客户端
      clientList.forEach((c) => {
        if (c !== client) {
          c.write(
            JSON.stringify({
              type: msgTypes.notice,
              content: `【系统】${client.nickname} 加入了聊天室！`,
            }),
          );
        }
      });

      return;
    }

    // 如果是私聊信息
    if (message.type === msgTypes.privateChat) {
      // 查找私聊对象
      const target = clientList.find((c) => {
        return c.nickname === message.nickname;
      });
      if (target) {
        target.write(
          JSON.stringify({
            type: msgTypes.privateChat,
            nickname: client.nickname,
            content: message.content,
          }),
        );
      }
    }

    // 如果是群发信息
    if (message.type === msgTypes.broadcast) {
      //
      clientList.forEach((c) => {
        if (c !== client) {
          c.write(
            JSON.stringify({
              type: msgTypes.broadcast,
              nickname: client.nickname,
              content: message.content,
            }),
          );
        }
      });
    }
  });

  // 监听end事件
  // 触发end事件表示对方已经关闭了可写流，不再发送新的消息，但是保留了可读流接收消息
  // 触发end事件时，应该在本方也调用socket.end()方法，关闭本方的可写流
  // 当读写流都关闭时会触发close事件（服务端和客户端都会触发）
  client.on("end", () => {
    console.log(`客户端 ${client.remoteAddress}:${client.remotePort} 断开连接`);
    client.end();
  });

  // 监听error事件
  // 当连接异常断开时（客户端程序崩溃，强制关闭，调用了.destroy()发送RST包等），
  // 会触发error==>close事件
  // 一定要监听error事件，否则进程回应为抛出错误（ECONNRESET）而崩溃
  client.on("error", (err) => {
    console.log(
      `与客户端 ${client.remoteAddress}:${client.remotePort}的连接发生错误，`,
      err,
    );
  });

  // 监听close事件
  client.on("close", (hadError) => {
    console.log(
      `客户端 ${client.remoteAddress}:${client.remotePort} 连接已关闭，hadError : ${hadError}`,
    );
    // 从客户端列表中移除断开连接的客户端
    const index = clientList.indexOf(client);
    if (index !== -1) {
      clientList.splice(index, 1);
      // 广播用户离开的消息给其他客户端
      clientList.forEach((c) => {
        c.write(
          JSON.stringify({
            type: msgTypes.notice,
            content: `【系统】${client.nickname} 离开了聊天室！`,
          }),
        );
      });
    }
  });
});

// 监听服务器错误事件
server.on("error", (err) => {
  console.error("服务器发生错误:", err);
});

// 监听服务器关闭事件
server.on("close", () => {
  console.log("服务器已关闭");
});

// 启动服务器，监听指定端口
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`服务器已启动，正在监听端口 ${PORT}...`);
});
