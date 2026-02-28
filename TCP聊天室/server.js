// TCP聊天室服务器
// 主要机能：
//  1.用户登录
//  2.消息群发
//  3.私聊
//  4.用户进出聊天室公告

import { createServer } from "net";
import { serverHandler } from "./serverHandler.js";

const server = createServer(serverHandler);

// 监听服务器的error事件
server.on("error", (err) => {
  console.log("服务器发生错误 ： \n", err);
  server.close();
});

// 监听服务器的close事件
server.on("close", () => {
  console.log("服务器正在关闭");
});

// 监听服务器的listening事件
server.on("listening", () => {
  console.log("服务器正在监听 : ", server.address());
});

// 监听
server.listen(8080, "127.0.0.1");
