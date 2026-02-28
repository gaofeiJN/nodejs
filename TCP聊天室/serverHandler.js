import { ChatMsg, MSG_TYPES } from "./ChatMsg.js";

// 所有连接的集合，用于管理登录的用户，及群发消息
const clients = new Set();

export function serverHandler(socket) {
  // 用户登录时提示输入昵称
  console.log(`客户端${socket.remoteAddress}:${socket.remotePort}正在连接`);
  const msg = new ChatMsg(MSG_TYPES.NOTICE, "【系统】", "", "欢迎，请输入昵称");
  socket.write(JSON.stringify(msg));

  // 监听data事件
  socket.on("data", dataHandler(socket));

  // 监听end事件
  //  正常关闭连接流程：
  //  1) 一方调用.end()方法，关闭可写流，可读流等待另一方的消息
  //  2) 另一方监听到end事件，可读流关闭
  //  3) 另一方，也调用.end()方法，关闭可写流
  //  4) 发起方监听到end事件，可读流关闭
  //  5) 双方都监听到close事件
  socket.on("end", () => {
    console.log(
      `客户端${socket.remoteAddress}:${socket.remotePort}正在断开连接`,
    );
    socket.end();
  });

  // 监听close事件
  // 监听到close事件后，应当在监听器中把客户端从列表中移除，同时广播客户退出的消息
  socket.on("close", (hadError) => {
    console.log(
      `客户端${socket.remoteAddress}:${socket.remotePort}的连接已断开（hadError : ${hadError}）。`,
    );

    // 广播顾客退出的消息
    let output = new ChatMsg(
      MSG_TYPES.NOTICE,
      "【系统】",
      "",
      `${socket.nickname}退出聊天室！目前在线人数：${clients.size - 1}`,
    );
    for (let client of clients) {
      if (client !== socket) {
        client.write(JSON.stringify(output));
      }
    }

    // 从列表中移除客户端
    clients.delete(socket);
  });

  // 监听error事件
  // 异常关闭连接流程
  //  1) 客户端强制关闭连接（进程崩溃，强制关闭进程，调用了.destroy()方法），触发close事件，但不一定触发error事件
  //  2) 服务端监听到error事件，随后监听到close事件（hadError为true）
  socket.on("err", (err) => {
    console.log(
      `客户端${socket.remoteAddress}:${socket.remotePort}的连接发生错误\n`,
      err,
    );
  });
}

// 处理客户端传入的data
// 为了访问socket对象，该函数定义成事件监听器的工厂函数
const dataHandler = function (socket) {
  return function (data) {
    // 解析顾客发送的消息
    const input = JSON.parse(data.toString().trim());

    // 如果socket对象中没有nickname属性，则顾客应该首先输入的昵称
    if (!socket.nickname) {
      // 如果客户端发送的不是登录信息，则要求顾客重新输入
      if (input.type !== MSG_TYPES.LOGIN) {
        let output = new ChatMsg(
          MSG_TYPES.NOTICE,
          "【系统】",
          "",
          "消息类型错误，请先输入昵称！",
        );
        socket.write(JSON.stringify(output));
        return;
      } else {
        // 检查昵称是否已被占用
        for (let client of clients) {
          if (client.nickname === input.content) {
            const output = new ChatMsg(
              MSG_TYPES.NOTICE,
              "【系统】",
              "",
              "该昵称已被占用，请重新输入！",
            );
            socket.write(JSON.stringify(output));
            return;
          }
        }
        // 将用户添加到客户端集合中，并发送登录成功消息
        socket.nickname = input.content;
        clients.add(socket);

        let output = new ChatMsg(
          MSG_TYPES.LOGIN,
          "【系统】",
          socket.nickname,
          `欢迎来到聊天室！目前在线人数：${clients.size}`,
        );
        socket.write(JSON.stringify(output));

        // 广播用户登录信息
        output = new ChatMsg(
          MSG_TYPES.NOTICE,
          "【系统】",
          "",
          `欢迎${socket.nickname}加入聊天室！目前在线人数：${clients.size}`,
        );
        for (let client of clients) {
          if (client !== socket) {
            client.write(JSON.stringify(output));
          }
        }

        return;
      }
    }

    // 群发消息
    if (input.type === MSG_TYPES.BROADCAST) {
      let output = new ChatMsg(
        MSG_TYPES.BROADCAST,
        `【${input.from}】`,
        "",
        input.content,
      );
      for (let client of clients) {
        if (client !== socket) {
          client.write(JSON.stringify(output));
        }
      }
      return;
    }

    // 私聊消息
    if (input.type === MSG_TYPES.PRIVATE) {
      let output = new ChatMsg(
        MSG_TYPES.PRIVATE,
        `【${input.from} 悄悄地说】`,
        input.to,
        input.content,
      );
      for (let client of clients) {
        if (client.nickname === input.to) {
          client.write(JSON.stringify(output));
          return;
        }
      }
      output = new ChatMsg(
        MSG_TYPES.NOTICE,
        "【系统】",
        input.from,
        "用户昵称错误，该用户不存在",
      );
      socket.write(JSON.stringify(output));
    }
  };
};
