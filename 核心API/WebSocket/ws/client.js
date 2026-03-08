import { WebSocket } from "ws";

// 创建WebSocket客户端
const client = new WebSocket("ws://127.0.0.1:8080");

//
client.on("open", () => {
  console.log("成功连接到服务器");

  // 成功连接后发送消息
  client.send("hello,server! this is client");

  let bf = Buffer.from("hello world");
  client.send(bf);

  bf = Buffer.from("quit");
  client.send(bf);
});

client.on("error", (error) => console.log(error));

client.on("close", (code, reason) => {
  console.log("--------------------------");
  console.log("连接正在关闭");
  console.log("code ：", code);
  console.log("reason ：", reason.toString());
});

client.on("message", (data, isBinary) => {
  console.log("--------------------------\n", "data :", data);
  console.log("data.toString() :", data.toString());
  console.log("isBinary :", isBinary);

  const msg = data.toString();
  if (msg === "quit") {
    console.log("--------------------------");
    client.close();
  }
});
