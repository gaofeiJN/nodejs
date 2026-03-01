// UDP聊天室 客户端
import dgram from "dgram";
import { ChatMsg } from "./ChatMsg.js";
import chalk from "chalk";
import { log } from "console";

let nickname = null;
const client = dgram.createSocket("udp4");

// 向服务器发送初始消息
client.send(
  JSON.stringify({
    type: ChatMsg.INIT,
    from: "new-user",
    to: "server",
    content: "hello from client",
  }),
  41234,
  "127.0.0.1",
);

// error事件
client.on("error", (err) => {
  console.log(chalk.red("客户端发生错误，", err));
});

// close事件
client.on("close", () => {
  console.log(chalk.yellow("正在关闭客户端"));
});

// message事件
client.on("message", (msg, rinfo) => {
  const message = msg.toString().trim();
  const obj = JSON.parse(message);
  let output = {};

  switch (obj.type) {
    case ChatMsg.NOTICE:
      console.log(chalk.yellow(`${obj.from} ${obj.content}`));
      break;

    case ChatMsg.LOGIN:
      nickname = obj.to;
      console.log(chalk.yellow(`${obj.from} ${obj.content}`));
      break;

    case ChatMsg.PRIVATE:
      console.log(chalk.magenta(`【${obj.from} 悄悄地说】${obj.content}`));
      break;

    case ChatMsg.BROADCAST:
      console.log(chalk.blue(`【${obj.from}】${obj.content}`));
      break;

    case ChatMsg.QUIT:
      client.close();
      process.exit(0);
      break;

    default:
      break;
  }
});

// 监听用户输入
process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  let output = {};

  // 如果还没有昵称，则用户的输入为昵称
  if (!nickname) {
    output = new ChatMsg(ChatMsg.LOGIN, "new-user", "server", input);
    client.send(JSON.stringify(output), 41234, "127.0.0.1");
    return;
  }

  // 如果输入为quit，则关闭客户端
  if (input === "quit") {
    output = new ChatMsg(ChatMsg.QUIT, nickname, "server", input);
    client.send(JSON.stringify(output), 41234, "127.0.0.1");

    return;
  }

  // 群发消息/私聊消息
  const reg = /^@(\w+) (.+)$/;
  const matches = reg.exec(input);
  if (matches) {
    output = new ChatMsg(ChatMsg.PRIVATE, nickname, matches[1], matches[2]);
    client.send(JSON.stringify(output), 41234, "127.0.0.1");
  } else {
    output = new ChatMsg(ChatMsg.BROADCAST, nickname, "", input);
    client.send(JSON.stringify(output), 41234, "127.0.0.1");
  }
});
