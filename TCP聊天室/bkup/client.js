const net = require("net");
const msgTypes = require("./msgTypes");
const chalk = require("chalk");

let nickname = null;

// 创建TCP客户端
const client = net.createConnection({
  address: "localhost",
  port: 8080,
});

// 监听连接成功事件
client.on("connect", () => {
  console.log(chalk.green("已连接到服务器！"));

  // 监听用户输入事件
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();

    // 如果还没有设置昵称，第一条输入就是昵称
    if (!nickname) {
      client.write(
        JSON.stringify({
          type: msgTypes.login,
          nickname: input,
        }),
      );
      return;
    }

    // 如果输入的是"quit"，则退出聊天室
    if (input.toLowerCase() === "quit") {
      console.log(chalk.green("正在退出聊天室..."));
      client.end();
      return;
      // 调用了socket.end()之后，
      //   1) 客户端关闭可写流，触发finish事件
      //   2) 向服务器发送FIN包，在服务器端触发end事件
      //   3) 客户端的可读流等待服务器可写流的数据
    }

    // 如果输入以@打头，则是私聊消息
    if (input.startsWith("@")) {
      const reg = /^@(\w{1,})\s(.*)$/;
      const match = reg.exec(input);
      // console.log(match);

      // 发送私聊信息
      client.write(
        JSON.stringify({
          type: msgTypes.privateChat,
          nickname: match[1],
          content: match[2],
        }),
      );

      return;
    }

    // 否则，输入的就是广播信息
    client.write(
      JSON.stringify({
        type: msgTypes.broadcast,
        content: input,
      }),
    );
  });
});

// 监听服务器发送的数据事件
client.on("data", (data) => {
  const message = JSON.parse(data.toString());

  // 如果还没有设置昵称，第一条消息就是系统发送的欢迎消息，提示输入昵称
  if (!nickname) {
    if (message.type === msgTypes.login) {
      if (message.success) {
        nickname = message.nickname;
        console.log(
          chalk.green(`${message.content} 当前在线人数: ${message.userCount}`),
        );
      } else {
        process.stdout.write(chalk.yellow(message.content));
      }
    }
    return;
  }

  // 处理服务器发送的其他消息
  switch (message.type) {
    case msgTypes.broadcast:
      console.log(chalk.blue(`【${message.nickname}】 ${message.content}`));
      break;
    case msgTypes.privateChat:
      console.log(
        chalk.magenta(`【${message.nickname}悄悄的说】: ${message.content}`),
      );
      break;
    case msgTypes.notice:
      console.log(chalk.yellow(message.content));
      break;
    default:
      console.log(chalk.red("收到未知类型的消息：", message));
      break;
  }
});

// 监听end事件
client.on("end", () => {
  console.log(chalk.yellow("【系统】断开了连接"));
});

// 监听error事件
client.on("error", (err) => {
  console.log(chalk.red("发生了错误：", err));
});

// 监听close事件
client.on("close", (hadError) => {
  console.log(chalk.yellow("【系统】连接已关闭，hadError：", hadError));
  process.exit(0);
});
