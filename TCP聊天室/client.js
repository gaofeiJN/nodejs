// TCP聊天室客户端

import { createConnection } from "net";
import { ChatMsg, MSG_TYPES } from "./ChatMsg.js";
import chalk from "chalk";

let nickname = null;

const client = createConnection({
  host: "127.0.0.1",
  port: 8080,
});

// 监听connect事件
client.on("connect", () => {
  // 监听用户输入事件
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();

    // 如果还没有nickname，则默认用户输入的是昵称
    if (!nickname) {
      const output = new ChatMsg(MSG_TYPES.LOGIN, "", "", input);
      client.write(JSON.stringify(output));
      return;
    }

    // 如果输入的是quit，则表示用户要退出聊天室
    if (input === "quit") {
      console.log(chalk.yellow("正在退出聊天室"));
      client.end();
      return;
    }

    // 如果输入的是"@<nickname> msg"格式，则为私聊消息
    const reg = /^@(\w+) (.+)$/;
    const matches = reg.exec(input);
    if (matches) {
      const output = new ChatMsg(
        MSG_TYPES.PRIVATE,
        nickname,
        matches[1],
        matches[2],
      );
      client.write(JSON.stringify(output));
      return;
    } else {
      // 否则，则为广播消息
      const output = new ChatMsg(MSG_TYPES.BROADCAST, nickname, "", input);
      client.write(JSON.stringify(output));
      return;
    }
  });
});

// 监听data事件
client.on("data", (data) => {
  const input = JSON.parse(data.toString().trim());

  // 显示消息
  switch (input.type) {
    case MSG_TYPES.NOTICE:
      console.log(
        chalk.yellow(`${input.from}`),
        chalk.yellow(`${input.content}`),
      );
      break;
    case MSG_TYPES.BROADCAST:
      console.log(chalk.blue(`${input.from}`), chalk.blue(`${input.content}`));
      break;
    case MSG_TYPES.PRIVATE:
      console.log(
        chalk.magenta(`${input.from}`),
        chalk.magenta(`${input.content}`),
      );
      break;
    case MSG_TYPES.LOGIN:
      console.log(
        chalk.green(`${input.from}`),
        chalk.green(`${input.content}`),
      );
      nickname = input.to;
      break;
  }
});

// 监听end事件
client.on("end", () => {
  console.log(chalk.yellow("系统正在关闭连接"));
  client.end();
});

// 监听error事件
client.on("error", (err) => {
  console.log(chalk.red("连接发生错误", err));
});

// 监听close事件
client.on("close", (hadError) => {
  console.log(chalk.yellow(`与服务器的连接已断开，hadError : ${hadError}`));
  process.exit(0);
});
