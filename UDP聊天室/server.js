// UDP聊天室
// 主要机能
//   1.顾客登录
//   2.维护顾客列表
//   3.广播消息
//   4.私聊消息
//   5.顾客登入登出广播

import dgram from "dgram";
import { ChatMsg } from "./ChatMsg.js";

const clients = new Set();
const server = dgram.createSocket("udp4");

// 监听error事件
server.on("error", (err) => {
  console.log("服务器发生错误，", err);
});

// 监听close事件
server.on("close", () => {
  console.log("服务器正在关闭...");
});

// 监听message事件
server.on("message", (msg, rinfo) => {
  const message = msg.toString().trim();
  console.log(`从${rinfo.address}:${rinfo.port} 接收到消息：${message}`);

  //
  const obj = JSON.parse(message);
  let output = {};
  switch (obj.type) {
    // 客户端的初始消息
    case ChatMsg.INIT:
      output = new ChatMsg(
        ChatMsg.NOTICE,
        "【系统】",
        "",
        "欢迎加入聊天室，请先输入昵称",
      );
      server.send(JSON.stringify(output), rinfo.port, rinfo.address);
      break;

    // 客户端的昵称消息
    case ChatMsg.LOGIN:
      let nickname = obj.content;
      // 检查昵称是否被占用
      for (let client of clients) {
        if (client.nickname === nickname) {
          output = new ChatMsg(
            ChatMsg.NOTICE,
            "【系统】",
            "",
            "该昵称已被占用，请重新输入",
          );
          server.send(JSON.stringify(output), rinfo.port, rinfo.address);
          return;
        }
      }

      // 昵称可用，向顾客发送欢迎消息，向其他顾客发送新顾客登录广播，并将新顾客加入集合中
      rinfo.nickname = nickname;

      output = new ChatMsg(
        ChatMsg.LOGIN,
        "【系统】",
        nickname,
        `登录成功，欢迎加入聊天室！目前在线人数：${clients.size + 1}`,
      );
      server.send(JSON.stringify(output), rinfo.port, rinfo.address);

      output = new ChatMsg(
        ChatMsg.NOTICE,
        "【系统】",
        "",
        `欢迎${rinfo.nickname}加入聊天室！目前在线人数：${clients.size + 1}`,
      );

      clients.forEach((client) => {
        server.send(JSON.stringify(output), client.port, client.address);
      });

      clients.add(rinfo);
      console.log("---------");
      console.log(clients);
      console.log("---------");

      break;

    // 广播消息
    case ChatMsg.BROADCAST:
      clients.forEach((client) => {
        if (client.nickname !== obj.from) {
          server.send(JSON.stringify(obj), client.port, client.address);
        }
      });
      break;

    // 私聊消息
    case ChatMsg.PRIVATE:
      for (let client of clients) {
        if (client.nickname === obj.to) {
          server.send(JSON.stringify(obj), client.port, client.address);
          return;
        }
      }

      output = new ChatMsg(
        ChatMsg.NOTICE,
        "【系统】",
        obj.from,
        "昵称错误，该用户不存在",
      );
      server.send(JSON.stringify(output), rinfo.port, rinfo.address);
      break;

    // 登出消息
    case ChatMsg.QUIT:
      let user = {};
      for (let client of clients) {
        if ((client.nickname === obj.from)) {
          user = client;
        }
      }
      clients.delete(user);
      output = new ChatMsg(ChatMsg.QUIT, "【系统】", user.nickname, "quit");
      server.send(JSON.stringify(output), user.port, user.address);
      output = new ChatMsg(
        ChatMsg.NOTICE,
        "【系统】",
        "",
        `用户${user.nickname}退出了群聊，当前在线人数：${clients.size}`,
      );
      clients.forEach((client) => {
        server.send(JSON.stringify(output), client.port, client.address);
      });
      break;

    // 其他消息
    default:
      break;
  }
});

// 监听listening事件
server.on("listening", () => {
  console.log(
    `服务器正在监听 ${server.address().address}:${server.address().port}`,
  );
});

server.bind(41234, "127.0.0.1");
